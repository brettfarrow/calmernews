export default function ToggleButton({ name, value, onClick }) {
  return (
    <button onClick={onClick} className={`toggle-button p-4 m-4 md:m-8 block`}>
      <span className={`underline underline-link`}>
        {value ? 'stop showing' : 'show'} {name}
      </span>
    </button>
  );
}
