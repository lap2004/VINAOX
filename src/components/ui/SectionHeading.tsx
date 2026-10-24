import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  titleLine1: string;
  titleLine2?: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
  italicLine2?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  titleLine1,
  titleLine2,
  description,
  align = 'left',
  light = false,
  italicLine2 = true,
  className = '',
}) => {
  return (
    <div
      className={`section-heading ${align === 'center' ? 'text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <span
          className={`section-eyebrow ${light ? 'section-eyebrow-light' : ''}`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`section-title title-serif ${
          light ? 'section-title-light' : ''
        }`}
      >
        <span>{titleLine1}</span>
        {titleLine2 && (
          <>
            <br />
            {italicLine2 ? <em>{titleLine2}</em> : <span>{titleLine2}</span>}
          </>
        )}
      </h2>
      {description && (
        <p
          className={`section-desc ${
            align === 'center' ? 'section-desc-center' : ''
          } ${light ? 'section-desc-light' : ''}`}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
};
