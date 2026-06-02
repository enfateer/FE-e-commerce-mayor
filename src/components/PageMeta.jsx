import { useEffect } from 'react';

const PageMeta = ({ title, description }) => {
  useEffect(() => {
    const formattedTitle = title ? `${title} | ORVIX Marketplace` : 'ORVIX - Premium Digital Marketplace';
    document.title = formattedTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
  }, [title, description]);

  return null;
};

export default PageMeta;
