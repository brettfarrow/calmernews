export default function ToggleButton({ name, value, onClick }) {
  return (
    <button onClick={onClick} className={`p-4`}>
      <span className={`underline underline-link`}>
        {value ? 'Stop Showing' : 'Show'} {name}
      </span>
    </button>
  );
}
