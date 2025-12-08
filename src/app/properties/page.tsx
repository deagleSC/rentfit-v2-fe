'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/tables/data-table';
import { usePropertyStore } from '@/zustand/stores/property-store';
import { useAuthStore } from '@/zustand/stores/auth-store';
import { ColumnDef } from '@tanstack/react-table';
import type { Property } from '@/types/property';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Home, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define columns for the properties table
const columns: ColumnDef<Property>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{property.title}</span>
        </div>
      );
    },
  },
  {
    id: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>
            {property.address.city}, {property.address.state}
          </span>
        </div>
      );
    },
  },
  {
    id: 'bhk',
    header: 'BHK',
    cell: ({ row }) => {
      const property = row.original;
      return <span className="font-medium">{property.specs.bhk}</span>;
    },
  },
  {
    accessorKey: 'expectedRent',
    header: 'Rent',
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">₹{property.expectedRent.toLocaleString()}/month</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const property = row.original;
      const statusColors = {
        vacant: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        occupied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      };
      return (
        <Badge className={statusColors[property.status]}>
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </Badge>
      );
    },
  },
];

export default function PropertiesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { properties, isLoading, getProperties } = usePropertyStore();

  // Fetch properties on mount
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      getProperties();
    }
  }, [isAuthenticated, authLoading, getProperties]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Handle row click
  const handleRowClick = (property: Property) => {
    router.push(`/properties/${property.id}`);
  };

  // Handle add new property
  const handleAddProperty = () => {
    router.push('/properties/new');
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>My Properties</CardTitle>
            <CardDescription>Loading your properties...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your rental properties in one place
            </p>
          </div>
          <Button onClick={handleAddProperty} size="lg" className="gap-2 w-full md:w-auto">
            <Plus className="h-4 w-4" />
            Add New Property
          </Button>
        </div>

        <DataTable columns={columns} data={properties} onRowClick={handleRowClick} />
      </div>
    </AppLayout>
  );
}
