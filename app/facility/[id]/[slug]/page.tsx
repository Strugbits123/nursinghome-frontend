


import * as React from 'react';
import FacilityDetailClient from "../../../components/FacilityDetailClient";


// interface Params {
//   id: string;
//   slug: string[];
// }

// Page is async by default for server components
export default async function FacilityDetailPage({params}: {params: Promise<{ slug: string }>}) {
  const { slug } = await params;

  return <FacilityDetailClient slug={slug} />;
}