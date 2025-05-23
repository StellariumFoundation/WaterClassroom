
import React from 'react';
import { APP_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-deep-blue text-brand-slate-medium mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Empowering learners through AI.
        </p>
        {/* <div className="mt-4 space-x-4">
          <a href="#" className="hover:text-brand-slate-light transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-slate-light transition-colors">Terms of Service</a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
