// src/components/RecentReportsSidebar.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { DisplayReport } from '@/lib/types/shareable-reports';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';

const RecentReportsSidebar: React.FC = () => {
  const [recentReports, setRecentReports] = useState<DisplayReport[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Handle report click
  const handleReportClick = useCallback(async (slug: string) => {
    try {
      await fetch(`/api/reports/${slug}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error tracking report view:', error);
    } finally {
      window.open(`/reports/${slug}`, '_blank');
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchRecentReports = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/dashboard/recent-reports');
        if (response.ok) {
          const result = await response.json();
          
          // Extract the data from the nested structure
          if (result.success && Array.isArray(result.data)) {
            setRecentReports(result.data);
          } else {
            console.warn('Unexpected API response structure:', result);
            setRecentReports([]);
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching recent reports:', err);
        setError('Failed to load recent reports. Please try again later.');
        setRecentReports([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentReports();
  }, []);

  // Setup Socket.IO client - FIXED
  useEffect(() => {
    // Only connect in browser environment
    if (typeof window === 'undefined') return;

    // Use correct environment variable for socket server
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    console.log('Connecting to Socket.IO server at:', socketUrl);
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server');
      setSocketConnected(true);
    });

    newSocket.on('newRecentReport', (report: DisplayReport) => {
      console.log('New recent report received:', report);
      setRecentReports((prevReports) => [report, ...prevReports].slice(0, 10));
    });

    newSocket.on('updatedRecentReport', (report: DisplayReport) => {
      console.log('Updated recent report received:', report);
      setRecentReports((prevReports) => {
        const existingIndex = prevReports.findIndex((r) => r.slug === report.slug);
        if (existingIndex > -1) {
          const updatedReports = [...prevReports];
          updatedReports[existingIndex] = report;
          return updatedReports;
        }
        return [report, ...prevReports].slice(0, 10);
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setSocketConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
      setSocketConnected(false);
    });

    newSocket.on('connect_timeout', () => {
      console.error('Socket.IO connection timeout');
      setSocketConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Track sidebar impressions
  useEffect(() => {
    if (isSidebarOpen && recentReports.length > 0) {
      const trackImpression = async () => {
        try {
          await fetch('/api/analytics/sidebar-impression', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Error tracking sidebar impression:', error);
        }
      };
      trackImpression();
    }
  }, [isSidebarOpen, recentReports.length]);

  const sidebarVariants = {
    open: { width: '300px', opacity: 1 },
    closed: { width: '0px', opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex h-full max-h-[calc(100vh-4rem)]">
      <motion.div
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
        className={cn(
          'bg-gray-800 text-white shadow-lg overflow-hidden',
          isSidebarOpen ? 'p-4' : 'p-0'
        )}
      >
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Public Reports</h3>
                <div className={`w-3 h-3 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                     title={socketConnected ? 'Connected' : 'Disconnected'} />
              </div>
              
              <div className="flex-grow overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-700 p-3 rounded-lg animate-pulse">
                        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <p className="text-sm text-red-400">{error}</p>
                ) : recentReports.length === 0 ? (
                  <p className="text-sm text-gray-400">No recent public reports yet.</p>
                ) : (
                  <motion.ul layout className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {recentReports.map((report) => (
                        <motion.li
                          key={report.slug}
                          layout
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={itemVariants}
                          transition={{ duration: 0.2 }}
                          className="bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                          onClick={() => handleReportClick(report.slug)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium flex items-center">
                              <Globe className="w-4 h-4 mr-1 text-gray-400" />
                              {report.displayUrl}
                            </span>
                            <span className={`text-xs font-bold ${
                              report.scoreColor === 'green' ? 'text-green-400' : 
                              report.scoreColor === 'yellow' ? 'text-yellow-400' : 
                              report.scoreColor === 'orange' ? 'text-orange-400' : 
                              'text-red-400'
                            }`}>
                              Score: {report.securityScore}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{report.timeAgo}</p>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <Button
        variant="ghost"
        size="icon"
        className="bg-gray-800 hover:bg-gray-700 text-white rounded-l-none rounded-r-lg h-12 w-8 self-center shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default RecentReportsSidebar;