import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { documentAPI } from "../services/api";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { toast } from "react-toastify";
import ChatWindow from "../components/chat/ChatWindow";
import EntitySidebar from "../components/dashboard/EntitySidebar";
import {
  MessageSquare,
  X,
  FileText,
  ArrowLeft,
  Share2,
  Download,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DocumentViewPage() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // --- Fetch document data ---
  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await documentAPI.getById(id);
        setDocument(response.data.document);
      } catch (err) {
        setError("Failed to load document. It might not exist or you do not have access.");
        toast.error("Failed to load document.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDocument();
    else {
      setLoading(false);
      setError("No document ID provided in the URL.");
    }
  }, [id]);

  // --- Favorite toggle ---
  const handleToggleFavorite = async () => {
    if (!document) return;
    try {
      await documentAPI.updateFavoriteStatus(document._id, !document.isFavorite);
      setDocument((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
      toast.success(`Document ${!document.isFavorite ? "added to" : "removed from"} favorites.`);
    } catch (err) {
      toast.error("Failed to update favorite status.");
    }
  };

  // --- Download document ---
  const handleDownload = () => {
    if (document?.cloudinaryUrl) {
      const link = document.createElement("a");
      link.href = document.cloudinaryUrl;
      link.download = document.title;
      link.click();
    }
  };

  // --- Share document ---
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: "Check out this document",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // --- Loading / Error / No Access states ---
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 text-lg">Loading document...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center max-w-md p-6 bg-white rounded-2xl shadow-lg">
          <FileText className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );

  if (!accessToken)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center max-w-md p-6 bg-white rounded-2xl shadow-lg">
          <X className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in again to access documents.</p>
          <Button onClick={() => (window.location.href = "/login")} variant="outline">
            Go to Login
          </Button>
        </div>
      </div>
    );

  // --- Main Layout ---
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="w-full px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                {document.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  PDF Document
                </Badge>
                {document.isFavorite && (
                  <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1 fill-current" /> Favorite
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFavorite}
              className="text-gray-600 hover:text-yellow-600"
            >
              <Star
                className={`w-4 h-4 mr-2 ${
                  document.isFavorite ? "fill-current text-yellow-500" : ""
                }`}
              />
              {document.isFavorite ? "Unfavorite" : "Favorite"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-gray-600 hover:text-blue-600"
            >
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-gray-600 hover:text-green-600"
            >
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          </div>
        </div>
      </header>

      {/* Content Layout */}
      <main className="w-full p-4">
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-140px)]">
          {/* PDF Viewer */}
          <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl overflow-hidden flex justify-center items-center">
            <div className="w-full h-[60vh] sm:h-[70vh] lg:h-full">
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer fileUrl={document.cloudinaryUrl} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            </div>
          </div>

          {/* Right Section (Chat + Entities) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex-1 overflow-hidden">
              <ChatWindow documentId={id} />
            </div>

            {/* You can add EntitySidebar later */}
            {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              <EntitySidebar documentId={id} />
            </div> */}
          </div>
        </div>
      </main>

      {/* Floating Chat Button (Mobile only) */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-transform hover:scale-105 z-40"
      >
        {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Mobile Chat Overlay */}
      {isChatOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI Chat</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatWindow documentId={id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
