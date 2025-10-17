import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Star, UserCircle, FileText, Eye, MessageSquare } from "lucide-react";
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

  const getEntityColor = (type) => {
    switch (type) {
      case 'PERSON':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ORG':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'LOCATION':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const thumbnailUrl = document.thumbnailUrl || `https://placehold.co/400x250/E0E7FF/3F51B5?text=PDF+Preview`;
  const authorName = document.uploadedBy?.name || 'Unknown User';

  const cardClasses = viewMode === 'list' 
    ? "group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row bg-white border border-gray-100"
    : "group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-gray-100";

  const imageClasses = viewMode === 'list'
    ? "relative w-full sm:w-48 h-32 sm:h-24 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden flex-shrink-0"
    : "relative w-full h-32 sm:h-40 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden";

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
          
          {/* PDF Badge */}
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            <FileText className="w-3 h-3 mr-1" />
            PDF
          </Badge>
          
          {/* Favorite Button */}
          <button
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-yellow-500 hover:bg-white hover:scale-110 transition-all duration-200 z-10"
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

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                <Eye className="w-4 h-4 text-gray-700" />
              </div>
              <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                <MessageSquare className="w-4 h-4 text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className={`p-4 space-y-3 flex-1 ${viewMode === 'list' ? 'sm:flex sm:flex-col sm:justify-between' : ''}`}>
        <div>
          <Link to={`/documents/${document._id}`}>
            <h3 className="font-semibold text-base leading-tight line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors" title={document.title}>
              {document.title}
            </h3>
          </Link>
          
          {document.uploadedAt && (
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <CalendarDays className="mr-2 h-4 w-4" />
              <time dateTime={document.uploadedAt}>
                {new Date(document.uploadedAt).toLocaleDateString()}
              </time>
            </div>
          )}
        </div>

        {/* Entities/Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {document.entities && document.entities.length > 0 ? (
            <>
              {document.entities.slice(0, viewMode === 'list' ? 2 : 3).map((entity, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-xs px-2 py-1 rounded-full border ${getEntityColor(entity.type)}`}
                >
                  {entity.text}
                </Badge>
              ))}
              {document.entities.length > (viewMode === 'list' ? 2 : 3) && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                >
                  +{document.entities.length - (viewMode === 'list' ? 2 : 3)} more
                </Badge>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">
              No entities detected
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className={`flex justify-between items-center border-t border-gray-100 p-4 bg-gray-50/50 ${viewMode === 'list' ? 'sm:flex-col sm:items-start sm:space-y-2' : ''}`}>
        <div className="flex items-center text-sm text-gray-600">
          <UserCircle className="h-4 w-4 mr-2 text-gray-400" />
          <span className="truncate">{authorName}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to={`/documents/${document._id}`}
            className="p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-full transition-colors"
            title="View Document"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete(document._id);
            }}
            className={`p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors
              ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Delete Document"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <FaSpinner className="animate-spin text-sm" />
            ) : (
              <FaTrash className="text-sm" />
            )}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
