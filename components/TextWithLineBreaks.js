import React from 'react';

const LineBreak = () => <br />;

const TextWithLineBreaks = ({ text }) => {
  return (
    <p className="whitespace-pre-line">
      {text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <LineBreak />
        </React.Fragment>
      ))}
    </p>
  );
};

export default TextWithLineBreaks;
