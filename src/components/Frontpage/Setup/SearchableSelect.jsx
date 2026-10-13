
import { useState } from 'react';
import classes from './Setup.module.css';

const SearchableSelect = ({ name, value, options, onChange, placeholder }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (option) => String(option.id) === String(value)
  );

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange({
      target: {
        name,
        value: String(option.id),
      },
    });

    setSearch('');
    setIsOpen(false);
  };

  return (
    <div className={classes.searchableSelect}>
      <input
        type="text"
        placeholder={placeholder}
        value={isOpen ? search : selectedOption?.name || ''}
        onFocus={() => {
          setSearch('');
          setIsOpen(true);
        }}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={() => setIsOpen(false)}
      />

      {isOpen && (
        <div className={classes.dropdown}>
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className={classes.dropdownOption}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(option);
              }}
            >
              {option.name}
            </div>
          ))}

          {filteredOptions.length === 0 && (
            <div className={classes.dropdownEmpty}>
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
