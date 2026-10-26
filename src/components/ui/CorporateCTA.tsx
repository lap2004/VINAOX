import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface CorporateCTAProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  primaryText: string;
  onPrimaryClick: () => void;
  primaryIcon?: ReactNode;
  secondaryText: string;
  secondaryLink?: string;
  onSecondaryClick?: () => void;
  className?: string;
}

export const CorporateCTA: React.FC<CorporateCTAProps> = ({
  eyebrow,
  title,
  description,
  primaryText,
  onPrimaryClick,
  primaryIcon = <ArrowRight size={16} />,
  secondaryText,
  secondaryLink = '/contact',
  onSecondaryClick,
  className = '',
}) => {
  return (
    <div className={`corporate-cta-card ${className}`}>
      <div className="corporate-cta-grid">
        <div className="corporate-cta-content">
          <span className="corporate-cta-eyebrow">{eyebrow}</span>
          <h2 className="title-serif corporate-cta-title">{title}</h2>
          <p className="corporate-cta-desc">{description}</p>
        </div>

        <div className="corporate-cta-actions">
          <Button
            variant="white"
            size="lg"
            onClick={onPrimaryClick}
            icon={primaryIcon}
            className="corporate-cta-btn corporate-cta-btn-primary"
          >
            {primaryText}
          </Button>

          {secondaryLink ? (
            <Link to={secondaryLink} className="corporate-cta-link">
              <Button
                variant="outline-white"
                size="lg"
                onClick={onSecondaryClick}
                className="corporate-cta-btn corporate-cta-btn-secondary"
              >
                {secondaryText}
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline-white"
              size="lg"
              onClick={onSecondaryClick}
              className="corporate-cta-btn corporate-cta-btn-secondary"
            >
              {secondaryText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CorporateCTA;
