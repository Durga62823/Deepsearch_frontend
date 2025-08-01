import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Star, UserCircle } from "lucide-react";
import { FaTrash, FaSpinner } from 'react-icons/fa';

const DocumentCard = ({ document, onDelete, isDeleting, onToggleFavorite, viewMode }) => {
  if (!document) {
    return null;
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

  const thumbnailUrl = document.thumbnailUrl || `https://placehold.co/400x250/E0E7FF/3F51B5?text=PDF+Preview`;
  const authorName = document.uploadedBy?.name || 'Unknown User';

  const cardClasses = viewMode === 'list' 
    ? "group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row"
    : "group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200";

  const imageClasses = viewMode === 'list'
    ? "relative w-full sm:w-48 h-32 sm:h-24 bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0"
    : "relative w-full h-32 sm:h-40 bg-gray-100 flex items-center justify-center overflow-hidden";

  return (
    <Card className={cardClasses}>
      <Link to={`/documents/${document._id}`} className="block">
        <div className={imageClasses}>
          <img
            src={thumbnailUrl}
            alt={`Thumbnail for ${document.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x250/E0E7FF/3F51B5?text=PDF+Preview`;
            }}
          />
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PDF
          </Badge>
          <button
            className="absolute top-2 right-2 p-1.5 sm:p-1 bg-white rounded-full shadow-md text-yellow-500 hover:scale-110 transition-transform duration-200 z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onToggleFavorite) {
                onToggleFavorite(document._id, !document.isFavorite);
              }
            }}
            aria-label={document.isFavorite ? "Unfavorite document" : "Favorite document"}
          >
            <Star className={`h-4 w-4 ${document.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
          </button>
        </div>
      </Link>

      <CardContent className={`p-3 sm:p-4 space-y-2 flex-1 ${viewMode === 'list' ? 'sm:flex sm:flex-col sm:justify-between' : ''}`}>
        <div>
          <Link to={`/documents/${document._id}`}>
            <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-2 text-foreground" title={document.title}>
              {document.title}
            </h3>
          </Link>
          
          {document.uploadedAt && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <CalendarDays className="mr-1 h-3 w-3" />
              <time dateTime={document.uploadedAt}>
                {new Date(document.uploadedAt).toLocaleDateString()}
              </time>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {document.entities && document.entities.length > 0 ? (
            <>
              {document.entities.slice(0, viewMode === 'list' ? 2 : 3).map((entity, index) => (
                <Badge
                  key={index}
                  variant={getEntityBadgeVariant(entity.type)}
                  className="text-xs px-2 py-0.5 rounded-full"
                >
                  {entity.text}
                </Badge>
              ))}
              {document.entities.length > (viewMode === 'list' ? 2 : 3) && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 rounded-full"
                >
                  +{document.entities.length - (viewMode === 'list' ? 2 : 3)} more
                </Badge>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground">
              No tags
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className={`flex justify-between items-center border-t p-3 bg-gray-50 ${viewMode === 'list' ? 'sm:flex-col sm:items-start sm:space-y-2' : ''}`}>
        <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
          <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 text-gray-500" />
          <span className="truncate">{authorName}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete(document._id);
          }}
          className={`p-1.5 sm:p-1 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition
            ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Delete Document"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <FaSpinner className="animate-spin text-sm sm:text-base" />
          ) : (
            <FaTrash className="text-sm sm:text-base" />
          )}
        </button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
