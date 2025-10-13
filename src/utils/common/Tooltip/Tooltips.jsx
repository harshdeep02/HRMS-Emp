// ReusableTooltip.jsx
import { Tooltip } from "@mui/material";

const Tooltips = ({
  title,
  placement = "right",
  customStyles = {},
  children,
  arrow = false,

}) => {
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      disableInteractive
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "#322f35",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 500,
            borderRadius: "6px",
            padding: "6px 12px",
            ...customStyles, // override styles if passed
          },
        },
        arrow: {
          sx: {
            color: "#322f35", // arrow ka color tooltip ke background jaisa
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default Tooltips;
/////////////////