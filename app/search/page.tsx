"use client";

import { Suspense } from "react";
import SearchResults from "../components/SearchPageComponent";

export default function Page() {

 return (
    <div>
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchResults />
      </Suspense>
    </div>
 );
}