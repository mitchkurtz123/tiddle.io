import { useApiQuery } from "@/hooks/shared/useApiQuery";
import { getBrandContactById } from "@/services/bubbleAPI";
import type { EnhancedBrandContact } from "./useBrandContactsList";
import { useBrands } from "./useBrands";
import { useMemo } from "react";

export function useBrandContactById(id: string) {
  // Fetch the specific contact
  const contactQuery = useApiQuery(
    ["brandContact", id],
    () => getBrandContactById(id),
    {
      enabled: !!id,
      staleTime: 30 * 1000, // 30 seconds
      config: {
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    }
  );

  // Fetch all brands for resolution
  const { data: brands } = useBrands();

  // Enhance the contact with resolved brand information
  const enhancedContact = useMemo((): EnhancedBrandContact | undefined => {
    if (!contactQuery.data || !brands) {
      return contactQuery.data as EnhancedBrandContact | undefined;
    }

    const contact = contactQuery.data;

    // Create brand lookup map for efficient resolution
    const brandMap = brands.reduce((acc, brand) => {
      acc[brand._id] = brand;
      return acc;
    }, {} as Record<string, typeof brands[0]>);

    // Resolve brand associations
    const resolvedBrand = contact.brand ? brandMap[contact.brand] : undefined;
    
    const resolvedAgencyBrands = contact["agency-brands"]
      ?.map(brandId => brandMap[brandId])
      .filter(Boolean) || [];

    return {
      ...contact,
      resolvedBrand,
      resolvedAgencyBrands,
    };
  }, [contactQuery.data, brands]);

  return {
    data: enhancedContact,
    isLoading: contactQuery.isLoading,
    error: contactQuery.error,
    refetch: contactQuery.refetch,
  };
}