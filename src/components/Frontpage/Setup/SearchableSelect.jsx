
import { useState } from 'react';
import classes from '@/css/Setup/Setup.module.css';

const SearchableSelect = ({ name, value, options, onChange, placeholder }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

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
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      );
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === 'Enter' && isOpen) {
      e.preventDefault();

      if (filteredOptions[activeIndex]) {
        handleSelect(filteredOptions[activeIndex]);
      }
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className={classes.searchableSelect}>
      <input
        type="text"
        placeholder={placeholder}
        role="combobox"
        aria-label={placeholder}
        aria-expanded={isOpen}
        aria-autocomplete="list"
        value={isOpen ? search : selectedOption?.name || ''}
        onFocus={() => {
          setSearch('');
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onChange={(e) => {
          setSearch(e.target.value);
          setActiveIndex(-1);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setIsOpen(false);
          setActiveIndex(-1);
        }}
      />

      {isOpen && (
        <div className={classes.dropdown} role="listbox">
          {filteredOptions.map((option, index) => (
            <div
              key={option.id}
              role="option"
              aria-selected={String(option.id) === String(value)}
              className={`${classes.dropdownOption} ${
                index === activeIndex ? classes.activeOption : ''
              }`}
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
