import * as React from 'react';
import PropTypes from 'prop-types';
import SelectUnstyled, { selectUnstyledClasses } from '@mui/base/SelectUnstyled';
import OptionUnstyled from '@mui/base/OptionUnstyled';
import { styled } from '@mui/system';
import { PopperUnstyled } from '@mui/base';
import api from '../../core/api';

const StyledButton = styled('button')`
  font-family: IBM Plex Sans, sans-serif;
  font-size: 1.2rem;
  box-sizing: border-box;
  min-height: calc(1.5em + 22px);
  background: transparent;
  border: none;
  padding: 10px;
  text-align: left;
  line-height: 1.5;
  color: white;
  display: flex;
  flex-direction: row;
  width: 140px;
  justify-content: space-between;
  align-items: center;

  &.${selectUnstyledClasses.expanded} {
    &::after {
      content: '▴';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }
`;

const StyledListbox = styled('ul')`
  font-family: IBM Plex Sans, sans-serif;
  font-size: 1rem;
  box-sizing: border-box;
  padding: 5px;
  margin: 0px 0;
  background: rgb(21,27,52);
  border-radius: 0.75em;
  color: white;
  overflow: auto;
  outline: 0px;
`;

const StyledOption = styled(OptionUnstyled)`
  background: rgb(21,27,52);
  list-style: none;
  padding: 8px;
  border-radius: 0.45em;
  cursor: default;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    background: rgb(8, 15, 42);
  }

  &:last-of-type {
    border-bottom: none;
  }

  & img {
    margin-right: 10px;
  }
`;

const StyledPopper = styled(PopperUnstyled)`
  z-index: 1;
`;

const CustomSelect = React.forwardRef(function CustomSelect(props, ref) {
  const components = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} ref={ref} components={components} />;
});

CustomSelect.propTypes = {
  components: PropTypes.shape({
    Listbox: PropTypes.elementType,
    Popper: PropTypes.func,
    Root: PropTypes.elementType,
  }),
};

const def_networks = [
  { code: 0, label: 'BNB' },
  { code: 1, label: 'POLYGON' }, // Corrigido para 'POLYGON'
  { code: 2, label: 'USDT' },
  { code: 3, label: 'ETH' },
  { code: 4, label: 'BTC' },
];

export default function SelectChain({ value, coins = def_networks, onChange, disabled }) {
  return (
    <CustomSelect defaultValue={0} value={value} onChange={onChange} disabled={disabled}>
      {coins.map((c) => (
        <StyledOption key={c.code} value={c.code}>
          <img
            loading="lazy"
            width="35"
            src={`${api.rootUrl}/img/icons/${c.label.toLowerCase()}.png`}
            alt={`Coin of ${c.label}`}
            onError={(e) => { e.target.onerror = null; e.target.src = '/img/icons/default.png'; }} // Fallback para imagem
          />
          <span>{c.label}</span>
        </StyledOption>
      ))}
    </CustomSelect>
  );
}