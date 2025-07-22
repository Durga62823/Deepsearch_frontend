import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, MapPin } from "lucide-react";

const EntitySidebar = ({ entities, selectedEntity, onSelect }) => {
  // Define entity types and their corresponding display names and Tailwind color classes
  const entityTypes = [
    { 
      type: 'PERSON', 
      name: 'People', 
      icon: User,
      variant: 'default'
    },
    { 
      type: 'ORG', 
      name: 'Organizations', 
      icon: Building2,
      variant: 'secondary'
    },
    { 
      type: 'LOCATION', 
      name: 'Locations', 
      icon: MapPin,
      variant: 'outline'
    },
  ];

  // If no entities are present, display a message
  if (!entities || entities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <p className="text-base">
            No entities extracted for this document.
          </p>
        </div>
      </div>
    );
  }

  return (
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
              <Icon className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-medium">{category.name}</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categoryEntities.map((entity, index) => {
                const isSelected = selectedEntity && 
                  selectedEntity.text === entity.text && 
                  selectedEntity.type === entity.type;

                return (
                  <Badge
                    key={`${category.type}-${entity.text}-${index}`}
                    variant={isSelected ? "default" : category.variant}
                    className={`
                      cursor-pointer transition-all text-sm
                      hover:bg-primary hover:text-primary-foreground
                      ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                    `}
                    onClick={() => onSelect(entity)}
                  >
                    {entity.text}
                  </Badge>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EntitySidebar;
