interface PopUpContentProps {
  area: string | undefined;
}

export const PopUpContent = ({ area }: PopUpContentProps) => {
  return (
    <div
      style={{ width: 100, color: "grey", fontWeight: "bold", fontSize: 12 }}
    >
      {area}
    </div>
  );
};
