import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, MapPin, Sparkles, Search } from "lucide-react";

const EntitySidebar = ({ entities, selectedEntity, onSelect }) => {
  // Define entity types and their corresponding display names and Tailwind color classes
  const entityTypes = [
    { 
      type: 'PERSON', 
      name: 'People', 
      icon: User,
      variant: 'default',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    { 
      type: 'ORG', 
      name: 'Organizations', 
      icon: Building2,
      variant: 'secondary',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    },
    { 
      type: 'LOCATION', 
      name: 'Locations', 
      icon: MapPin,
      variant: 'outline',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
  ];

  // If no entities are present, display a message
  if (!entities || entities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Entities Found</h3>
        <p className="text-gray-600 text-sm">
          This document doesn't contain any recognizable people, organizations, or locations.
        </p>
      </div>
    );
  }

  const handleEntityClick = (entity) => {
    if (onSelect) {
      onSelect(entity);
    }
  };

  const handleSearchEntity = (entity) => {
    // This could trigger a search in the chat or highlight in the PDF
    console.log('Searching for entity:', entity.text);
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        {entityTypes.map((category) => {
          const categoryEntities = entities.filter(e => e.type === category.type);
          
          if (categoryEntities.length === 0) {
            return null;
          }

          const Icon = category.icon;

          return (
            <div key={category.type} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <Icon className={`h-4 w-4 ${category.textColor}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-xs text-gray-500">{categoryEntities.length} found</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {categoryEntities.map((entity, index) => {
                  const isSelected = selectedEntity && 
                    selectedEntity.text === entity.text && 
                    selectedEntity.type === entity.type;

                  return (
                    <div
                      key={`${category.type}-${entity.text}-${index}`}
                      className={`group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? `${category.bgColor} ${category.borderColor} border-2 shadow-sm` 
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleEntityClick(entity)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isSelected ? category.textColor : 'text-gray-900'
                        }`}>
                          {entity.text}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {category.name.toLowerCase()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSearchEntity(entity);
                          }}
                          className="h-6 w-6 p-0 hover:bg-gray-100"
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* Summary Stats */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-semibold text-gray-900">Document Summary</h4>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {entityTypes.map((category) => {
              const count = entities.filter(e => e.type === category.type).length;
              return (
                <div key={category.type} className="text-center">
                  <p className="text-lg font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-600">{category.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default EntitySidebar;
