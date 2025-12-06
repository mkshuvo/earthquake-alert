'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import apiService, { SearchQueryParams, PaginatedResponse } from '../../../services/apiService';
import { EarthquakeEvent } from '../../../store/earthquakeStore';
import SearchFilters from '../../components/search/SearchFilters';
import SearchResults from '../../components/search/SearchResults';
import SearchMap from '../../components/search/SearchMap';
import Pagination from '../../components/search/Pagination';
import { ArrowLeft, List, Map as MapIcon } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PaginatedResponse<EarthquakeEvent> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params: SearchQueryParams = {
          q: searchParams.get('q') || undefined,
          minMagnitude: searchParams.get('minMagnitude') ? Number(searchParams.get('minMagnitude')) : undefined,
          maxMagnitude: searchParams.get('maxMagnitude') ? Number(searchParams.get('maxMagnitude')) : undefined,
          minDepth: searchParams.get('minDepth') ? Number(searchParams.get('minDepth')) : undefined,
          maxDepth: searchParams.get('maxDepth') ? Number(searchParams.get('maxDepth')) : undefined,
          startDate: searchParams.get('startDate') || undefined,
          endDate: searchParams.get('endDate') || undefined,
          sortBy: (searchParams.get('sortBy') as any) || undefined,
          order: (searchParams.get('order') as any) || undefined,
          page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
          limit: 20, // Default limit
        };

        // Clean up undefined values
        Object.keys(params).forEach(key => {
            if ((params as any)[key] === undefined) {
                delete (params as any)[key];
            }
        });

        const response = await apiService.searchEarthquakes(params);
        setData(response);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to load search results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const router = useRouter();
  const onPageChange = (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`/earthquakes/search?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <SearchFilters />
        </div>
      </div>

      {/* Results Area */}
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Search Results
          </h2>
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              title="Map View"
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {viewMode === 'list' ? (
          <>
            <SearchResults 
              results={data?.data || []} 
              isLoading={isLoading} 
              total={data?.meta.total || 0}
            />
            {data && data.meta.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={data.meta.page}
                  totalPages={data.meta.totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        ) : (
          <SearchMap results={data?.data || []} />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Advanced Search
          </h1>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        }>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
