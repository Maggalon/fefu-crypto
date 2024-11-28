import QRCode from 'react-qr-code';
import Modal from 'react-modal';
import QRCodeStyling from 'qr-code-styling';

import { useState, useRef, useEffect } from 'react';

const QRModal = ({ showQR, setShowQR, value }) => {

    Modal.setAppElement('#root');
  
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
      },
    };

    const [options] = useState({
      width: 300,
      height: 300,
      type: 'svg',
      data: value,
      image: '',
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q'
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 20,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        color: '#000000',
        type: 'rounded'
      },
      backgroundOptions: {
        color: 'none',
      },
      cornersSquareOptions: {
        color: '#000000',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '#000000',
        type: 'dot',
      }
    });
  
    const [qrCode] = useState(new QRCodeStyling(options))
    const ref = useRef(null)

    useEffect(() => {
      if (ref.current) {
        qrCode.append(ref.current);
      }
    }, [qrCode, ref, showQR]);
  
    useEffect(() => {
      if (!qrCode) return;
      qrCode.update(options);
    }, [qrCode, options, showQR]);
  
    return (
      <div>
        <Modal isOpen={showQR} style={customStyles}>
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl pr-20 font-medium text-gray-900 dark:text-white">
                  {value}
              </h3>
              <button type="button" 
                      onClick={() => setShowQR(false)} 
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="small-modal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
              </button>
          </div>
          <div className='flex h-full justify-center items-center'>
            {/* <div ref={ref} /> */}
            <QRCode
              size={64}
              style={{ height: "auto", width: "85%", margin: "2rem" }}
              value={value}
              viewBox={`0 0 256 256`}
            />
          </div>
        </Modal>
      </div>
    )
  }

export default QRModal;