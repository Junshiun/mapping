export const SelectSearchBox = ({
  Icon,
  setSearch,
  searchFunction,
  active,
}) => {
  return (
    <button
      className={active ? "active" : ""}
      onClick={() => {
        setSearch(searchFunction);
      }}
    >
      <Icon></Icon>
    </button>
  );
};
