import { useState } from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from 'framer-motion';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TRACTOR_CATEGORIES, 
  TRACTOR_BRANDS, 
  HORSEPOWER_RANGES, 
  YEARS,
} from '@/lib/constants';

// Define the filter schema
const filterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  maxYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  minHP: z.number().min(0).optional(),
  maxHP: z.number().min(0).optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

export default function TractorFilters() {
  const [_, navigate] = useLocation();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [hpRange, setHpRange] = useState<[number, number]>([0, 500]);
  
  // Form definition
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      category: "",
      brand: "",
      minPrice: 0,
      maxPrice: 1000000,
      minYear: 1980,
      maxYear: new Date().getFullYear(),
      minHP: 0,
      maxHP: 500,
    },
  });
  
  // Update form values from slider
  const updatePriceRange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    form.setValue('minPrice', values[0]);
    form.setValue('maxPrice', values[1]);
  };
  
  const updateHpRange = (values: number[]) => {
    setHpRange([values[0], values[1]]);
    form.setValue('minHP', values[0]);
    form.setValue('maxHP', values[1]);
  };
  
  // Handle form submission
  const onSubmit = (data: FilterValues) => {
    // Build query string based on filter values
    const params = new URLSearchParams();
    
    if (data.search) params.append('search', data.search);
    if (data.category) params.append('category', data.category);
    if (data.brand) params.append('brand', data.brand);
    if (data.minPrice !== undefined) params.append('minPrice', data.minPrice.toString());
    if (data.maxPrice !== undefined) params.append('maxPrice', data.maxPrice.toString());
    if (data.minYear !== undefined) params.append('minYear', data.minYear.toString());
    if (data.maxYear !== undefined) params.append('maxYear', data.maxYear.toString());
    if (data.minHP !== undefined) params.append('minHP', data.minHP.toString());
    if (data.maxHP !== undefined) params.append('maxHP', data.maxHP.toString());
    
    // Navigate to tractors page with filters
    navigate(`/tractors?${params.toString()}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    form.reset();
    setPriceRange([0, 1000000]);
    setHpRange([0, 500]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="font-heading font-bold text-xl mb-6">Filter Tractors</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Search */}
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Search tractors..." 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {TRACTOR_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">All Brands</SelectItem>
                    {TRACTOR_BRANDS.map((brand) => (
                      <SelectItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          {/* Price Range */}
          <div className="space-y-2">
            <FormLabel>Price Range (₹)</FormLabel>
            <Slider
              min={0}
              max={1000000}
              step={10000}
              value={priceRange}
              onValueChange={updatePriceRange}
              className="my-6"
            />
            <div className="flex items-center justify-between text-sm">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
          
          {/* Year Range */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Year</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Min Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Year</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Max Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          
          {/* Horsepower Range */}
          <div className="space-y-2">
            <FormLabel>Horsepower</FormLabel>
            <Slider
              min={0}
              max={500}
              step={10}
              value={hpRange}
              onValueChange={updateHpRange}
              className="my-6"
            />
            <div className="flex items-center justify-between text-sm">
              <span>{hpRange[0]} HP</span>
              <span>{hpRange[1]} HP</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetFilters}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
