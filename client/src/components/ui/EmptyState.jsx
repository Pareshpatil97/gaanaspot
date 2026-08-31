import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface/30 rounded-2xl border border-border/50 border-dashed">
      {Icon && (
        <div className="bg-surface p-4 rounded-full mb-4 ring-1 ring-border shadow-lg">
          <Icon className="w-8 h-8 text-text-muted" />
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-text-secondary mb-6 max-w-md">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
