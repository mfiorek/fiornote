import React, { MouseEventHandler } from 'react';
import Link from 'next/link';
import { DocumentIcon, FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline';

interface ContentButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
  variant: 'folder' | 'note';
  isSelected?: boolean;
}

const ContentButton: React.FC<ContentButtonProps> = ({ onClick, text, variant, isSelected }) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'folder':
        return 'border-sky-600';
      case 'note':
        return 'border-emerald-600';
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'folder':
        return isSelected ? 'bg-sky-800' : 'bg-slate-700';
      case 'note':
        return isSelected ? 'bg-emerald-800' : 'bg-slate-700';
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'folder':
        return isSelected ? <FolderOpenIcon className='h-6 w-6' /> : <FolderIcon className='h-6 w-6 text-sky-600' />;
      case 'note':
        return <DocumentIcon className={`h-6 w-6 ${!isSelected && 'text-emerald-600'}`} />;
      default:
        return null;
    }
  };

  return (
    <button className={`flex w-full gap-2 rounded border ${getBorderColor()} ${getBackgroundColor()} p-3`} onClick={onClick}>
      <div className='flex w-full items-center justify-between'>
        <div className='flex flex-1 gap-2'>
          {getIcon()}
          <p className={`${isSelected && 'font-bold'}`}>{text}</p>
        </div>
      </div>
    </button>
  );
};

export default ContentButton;
