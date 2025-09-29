


import * as React from 'react';
import FacilityDetailClient from "../../../components/FacilityDetailClient";


interface FacilityDetailPageProps {
    params: {
        id: string;
        slug: string;
    };
}

// Keep the function 'async'
export default async function FacilityDetailPage({ params }: FacilityDetailPageProps) {
    // Accessing params after 'async' is the standard App Router solution.
    const { slug } = params; 
    
    return <FacilityDetailClient slug={slug} />;
}