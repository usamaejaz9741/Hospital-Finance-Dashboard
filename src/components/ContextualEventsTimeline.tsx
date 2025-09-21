import React, { useState } from 'react';
import { ContextualEvent } from '../types/finance';

interface ContextualEventsTimelineProps {
  events: ContextualEvent[];
  onEventSelect?: (event: ContextualEvent) => void;
  loading?: boolean;
  error?: string;
}

/**
 * Contextual Events Timeline implementing GP Spec Sheet requirements
 * 
 * Features:
 * - Timeline visualization of significant events
 * - Impact level indicators
 * - Event type categorization
 * - Click-to-drill-down functionality
 * - Integration with financial data
 * 
 * @component
 * @category Enhanced Financial Analysis
 * @since 2.0.0
 */
const ContextualEventsTimeline: React.FC<ContextualEventsTimelineProps> = ({
  events,
  onEventSelect,
  loading = false,
  error
}) => {
  const [selectedEvent, setSelectedEvent] = useState<ContextualEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Event type configurations
  const eventTypeConfig = {
    merger: { color: '#3b82f6', icon: '🔗', label: 'Merger' },
    acquisition: { color: '#8b5cf6', icon: '🏥', label: 'Acquisition' },
    leadership_change: { color: '#10b981', icon: '👤', label: 'Leadership Change' },
    market_change: { color: '#f59e0b', icon: '📈', label: 'Market Change' },
    regulatory: { color: '#ef4444', icon: '⚖️', label: 'Regulatory' },
    other: { color: '#6b7280', icon: '📋', label: 'Other' }
  };

  // Impact level configurations
  const impactConfig = {
    high: { color: 'text-red-400', size: 'h-3 w-3', label: 'High Impact' },
    medium: { color: 'text-yellow-400', size: 'h-2 w-2', label: 'Medium Impact' },
    low: { color: 'text-green-400', size: 'h-1 w-1', label: 'Low Impact' }
  };

  // Filter events based on selected type
  const filteredEvents = events.filter(event => 
    filterType === 'all' || event.type === filterType
  );

  // Sort events by date (newest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEventClick = (event: ContextualEvent) => {
    setSelectedEvent(event);
    onEventSelect?.(event);
  };

  if (loading) {
    return (
      <div className="chart-container flex items-center justify-center">
        <div className="animate-pulse text-white">Loading contextual events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container flex items-center justify-center">
        <div className="text-red-400">Error loading events: {error}</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
        <h2 className="mobile-heading-scale font-bold gradient-text">Contextual Events Timeline</h2>
      </div>
        
      {/* Event Type Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilterType('all')}
          className={`btn-base btn-sm transition-all ${
            filterType === 'all'
              ? 'btn-primary'
              : 'btn-secondary'
          }`}
        >
          All Events
        </button>
        {Object.entries(eventTypeConfig).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`btn-base btn-sm transition-all ${
              filterType === type
                ? 'text-white'
                : 'text-gray-300 hover:text-white'
            }`}
            style={{
              backgroundColor: filterType === type ? config.color : undefined,
              borderColor: config.color,
              borderWidth: filterType === type ? '0' : '1px'
            }}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-600"></div>
        
        {/* Events */}
        <div className="space-y-6">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No events found for the selected filter
            </div>
          ) : (
            sortedEvents.map((event) => {
              const typeConfig = eventTypeConfig[event.type];
              const impactLevel = impactConfig[event.impact];
              
              return (
                <div key={event.id} className="relative flex items-start">
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div 
                      className="rounded-full p-3 shadow-lg"
                      style={{ backgroundColor: typeConfig.color }}
                    >
                    </div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="ml-6 flex-1">
                    <div 
                      className="glass-card rounded-xl mobile-card-padding cursor-pointer transition-all hover:bg-white/5 border border-white/20 hover:border-purple-500/50"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-white">
                          {event.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.impact === 'high' ? 'bg-red-900/50 text-red-300' :
                            event.impact === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-green-900/50 text-green-300'
                          }`}>
                            {impactLevel.label}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">
                        {event.description}
                      </p>
                      
                      {/* Affected Metrics */}
                      {event.affectedMetrics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-gray-400">Affected Metrics:</span>
                          {event.affectedMetrics.map((metric, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-purple-900/60 text-white rounded-full text-xs font-medium"
                            >
                              {metric}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="gradient-bg-primary rounded-xl p-6 border border-white/30 backdrop-blur-sm shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">
                Event Details
              </h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {selectedEvent.title}
                </h4>
                <p className="text-gray-300">
                  {selectedEvent.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white ml-2">
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2">
                    {eventTypeConfig[selectedEvent.type].icon} {eventTypeConfig[selectedEvent.type].label}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Impact:</span>
                  <span className={`ml-2 ${
                    selectedEvent.impact === 'high' ? 'text-red-400' :
                    selectedEvent.impact === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {impactConfig[selectedEvent.impact].label}
                  </span>
                </div>
              </div>
              
              {selectedEvent.affectedMetrics.length > 0 && (
                <div>
                  <span className="text-gray-400 block mb-2">Affected Financial Metrics:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.affectedMetrics.map((metric, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-purple-900/60 text-white rounded-full text-sm font-medium"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Summary */}
      <div className="glass-card rounded-xl mobile-card-padding border border-white/20 mt-8">
        <div className="performance-insight-container">
          <div className="performance-insight-header">
            <div style={{ 
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
            }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <span className="performance-insight-title">Event Summary</span>
            <button className="ml-2 btn-base btn-primary btn-sm" style={{ padding: '4px 8px', fontSize: 'var(--font-size-xs)', borderRadius: '4px', height: 'auto', minHeight: 'unset' }} aria-label="AI-powered insights">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
              </svg>
              <span className="ml-1 text-xs font-medium">AI</span>
            </button>
          </div>
          <div className="performance-insight-grid">
            <div className="performance-insight-card blue">
              <div className="performance-insight-card-value">{events.length}</div>
              <div className="performance-insight-card-label">Total Events</div>
              <div className="performance-insight-card-context">All Events</div>
            </div>
            <div className="performance-insight-card red">
              <div className="performance-insight-card-value">
                {events.filter(e => e.impact === 'high').length}
              </div>
              <div className="performance-insight-card-label">High Impact</div>
              <div className="performance-insight-card-context">Critical Events</div>
            </div>
            <div className="performance-insight-card amber">
              <div className="performance-insight-card-value">
                {events.filter(e => e.impact === 'medium').length}
              </div>
              <div className="performance-insight-card-label">Medium Impact</div>
              <div className="performance-insight-card-context">Significant Events</div>
            </div>
            <div className="performance-insight-card green">
              <div className="performance-insight-card-value">
                {events.filter(e => e.impact === 'low').length}
              </div>
              <div className="performance-insight-card-label">Low Impact</div>
              <div className="performance-insight-card-context">Minor Events</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualEventsTimeline;
