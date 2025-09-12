// hooks/useBrandContactsList.ts
import { useMemo } from 'react';
import { listAllBrandContacts, BubbleThing, BrandContact, Brand } from "../services/bubbleAPI";
import { useApiQuery } from "@/hooks/shared/useApiQuery";
import { useBrands } from "./useBrands";

/** Enhanced brand contact with resolved brand information */
export type EnhancedBrandContact = BubbleThing & BrandContact & {
  resolvedBrand?: BubbleThing & Brand; // The contact's associated brand
  resolvedAgencyBrands?: (BubbleThing & Brand)[]; // Array of resolved agency brands
};

export function useBrandContactsList() {
  // Fetch all brand contacts
  const contactsQuery = useApiQuery<(BubbleThing & BrandContact)[]>(
    ["brandContacts"],
    () => listAllBrandContacts(),
    {
      config: {
        staleTime: 30_000, // 30 seconds - consistent with other queries
      },
    }
  );

  // Fetch all brands for resolution
  const { data: brands } = useBrands();

  // Create enhanced contacts with resolved brand data
  const enhancedContacts = useMemo((): EnhancedBrandContact[] => {
    if (!contactsQuery.data || !brands) {
      return [];
    }

    // Create brand lookup map for efficient resolution
    const brandMap = brands.reduce((acc, brand) => {
      acc[brand._id] = brand;
      return acc;
    }, {} as Record<string, BubbleThing & Brand>);

    // Enhance each contact with resolved brand information
    return contactsQuery.data.map(contact => {
      const resolvedBrand = contact.brand ? brandMap[contact.brand] : undefined;
      
      const resolvedAgencyBrands = contact["agency-brands"]
        ?.map(brandId => brandMap[brandId])
        .filter(Boolean) || [];

      return {
        ...contact,
        resolvedBrand,
        resolvedAgencyBrands,
      };
    });
  }, [contactsQuery.data, brands]);

  return {
    ...contactsQuery,
    data: enhancedContacts,
    // Expose raw data if needed
    rawContacts: contactsQuery.data,
    brands,
  };
}