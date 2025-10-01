import QRCode from "react-qr-code";

function QRCodeGenerator({ value }) {
  return (
    <div style={{ background: "white", padding: "16px" }}>
      <QRCode
        value={value}
        size={256}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
      />
    </div>
  );
}

export default QRCodeGenerator;
