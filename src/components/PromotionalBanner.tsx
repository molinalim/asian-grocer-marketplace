
import React from 'react';

interface PromotionalBannerProps {
  title: string;
  description: string;
  backgroundImage: string;
  link: string;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  title,
  description,
  backgroundImage,
  link
}) => {
  return (
    <div
      className="relative rounded-lg overflow-hidden h-64 md:h-80 my-10"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="px-8 md:px-12 py-8">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">{title}</h2>
          <p className="text-white text-md md:text-lg mb-6 max-w-md">{description}</p>
          <a
            href={link}
            className="inline-block bg-accent hover:bg-accent-hover text-accent-foreground px-6 py-2 rounded-md transition-colors"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
