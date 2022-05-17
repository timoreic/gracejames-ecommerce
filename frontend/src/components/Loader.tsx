export const Loader = ({ text = '', size = '5em' }) => {
  const header = text ? <strong>{text}</strong> : null;
  return (
    <div className="mt-5">
      {header}
      <div className="spinner-border mx-5" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
