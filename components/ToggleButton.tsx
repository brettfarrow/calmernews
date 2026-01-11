type ToggleButtonProps = {
  name: string;
  value: boolean;
  onClick: () => void;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({ name, value, onClick }) => {
  return (
    <button onClick={onClick} className="toggle-button text-gray-500 dark:text-gray-400 text-[0.8rem] transition-colors duration-150 hover:text-gray-700 hover:dark:text-gray-200 p-4 m-4 md:m-8 block">
      <span className="underline text-gray-600 dark:text-gray-100 hover:text-gray-800 hover:dark:text-white">
        {value ? 'stop showing' : 'show'} {name}
      </span>
    </button>
  );
};

export default ToggleButton;
