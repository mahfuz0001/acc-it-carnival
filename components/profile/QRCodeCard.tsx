import { useQRCode } from 'next-qrcode';

interface QRCodeCardProps {
  uid: string;
}

export function QRCodeCard({ uid }: QRCodeCardProps) {
      const { Canvas } = useQRCode();

  return (
    <div className="items-center my-6">
      {/* <span className="mb-2 font-semibold">Your QR Code</span> */}
       <Canvas
      text={uid}
      options={{
        errorCorrectionLevel: 'M',
        margin: 4,
        scale: 4,
        width: 200,
        // color: {
        //   dark: '#010599FF',
        //   light: '#FFBF60FF',
        // },
      }}
    />
    </div>
  );
}
