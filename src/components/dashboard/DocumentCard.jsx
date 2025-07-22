// src/components/dashboard/DocumentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // For navigating to individual document view
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ChevronRight } from "lucide-react";

// DocumentCard component displays a summary of a single document
const DocumentCard = ({ document }) => {
  // Return null if no document data is provided
  if (!document) {
    return null; // Or a placeholder if preferred
  }

  const getEntityBadgeVariant = (type) => {
    switch (type) {
      case 'PERSON':
        return 'default';
      case 'ORG':
        return 'secondary';
      case 'LOCATION':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Link to={`/documents/${document._id}`}>
      <Card className="group hover:shadow-md transition-all">
        <CardHeader className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2" title={document.title}>
              {document.title}
            </h3>
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
          {document.uploadedAt && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="mr-1 h-3 w-3" />
              <time dateTime={document.uploadedAt}>
                {new Date(document.uploadedAt).toLocaleDateString()}
              </time>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {document.cleanedTextPreview || 'No text preview available.'}
          </p>
        </CardContent>

        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {document.entities && document.entities.length > 0 ? (
              <>
                {document.entities.slice(0, 3).map((entity, index) => (
                  <Badge
                    key={index}
                    variant={getEntityBadgeVariant(entity.type)}
                    className="text-xs"
                  >
                    {entity.text}
                  </Badge>
                ))}
                {document.entities.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs"
                  >
                    +{document.entities.length - 3} more
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                No entities extracted
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DocumentCard;
