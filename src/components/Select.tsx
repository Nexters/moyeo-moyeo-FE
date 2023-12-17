import ReactSelect, { GroupBase, Props, StylesConfig } from 'react-select';

// @note: option과 single select인걸 미리 타입 지정해놓음
// 지정하지 않으면 option이 unknown으로 나옴...
export type SelectProps = Props<{ label: string; value: string }, false> & {
  isError?: boolean;
};

export const Select = ({ isError, ...restProps }: SelectProps) => {
  return (
    <ReactSelect
      menuPortalTarget={document.body}
      menuShouldScrollIntoView={false}
      // isSearchable = true이면 모바일에서 검색이 가능해짐
      isSearchable={false}
      {...restProps}
      // @todo: style 변경은 일단 미지원...
      styles={
        {
          control: (styles, { menuIsOpen }) => ({
            ...styles,
            height: '50px',
            paddingLeft: '16px',
            backgroundColor: menuIsOpen ? '#0C0C0E' : 'rgba(12, 13, 14, 0.50)',
            color: '#fff',
            borderRadius: menuIsOpen ? '12px 12px 0 0' : '12px',
            borderWidth: '2px',
            borderColor: menuIsOpen
              ? '#3E029E'
              : isError
                ? '#FF453A'
                : '#3A3946',
            borderBottomColor: menuIsOpen ? 'transparent' : undefined,
            fontSize: '16px',
            fontWeight: '600',
            outline: 'none',
            boxShadow: 'none',
            transition: 'none',
            ':hover': {
              ...styles[':hover'],
              borderColor: menuIsOpen
                ? '#3E029E'
                : isError
                  ? '#FF453A'
                  : '#3A3946',
            },
          }),
          dropdownIndicator: (styles) => ({
            ...styles,
            color: '#6D677E',
            ':hover': {
              ...styles[':hover'],
              color: '#6D677E',
            },
          }),
          singleValue: (styles) => ({ ...styles, color: '#fff' }),
          valueContainer: (styles) => ({ ...styles, padding: '0' }),
          indicatorSeparator: (styles) => ({ ...styles, display: 'none' }),
          menu: (styles) => ({
            ...styles,
            marginTop: '-2px',
            borderRadius: '0 0 12px 12px',
            backgroundColor: '#0C0C0E',
            border: '2px solid #3E029E',
            borderTop: 'none',
            overflow: 'hidden',
          }),
          option: (styles, { isSelected }) => ({
            ...styles,
            padding: '16px',
            backgroundColor: isSelected ? '#3E029E' : '#0C0C0E',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            ':active': {
              ...styles[':active'],
              backgroundColor: '#3E029E',
            },
          }),
          // @note: 타입 추론을 위한 assert
        } as StylesConfig<
          { label: string; value: string },
          false,
          GroupBase<{ label: string; value: string }>
        >
      }
    />
  );
};
