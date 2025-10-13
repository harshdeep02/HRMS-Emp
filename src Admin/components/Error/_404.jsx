import { useState, useEffect } from 'react';
import './_404.scss';

const _404 = () => {
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        // 3 second delay
        const timer = setTimeout(() => {
            setShowImage(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <main>
            <div className="container">
                {!showImage ? (
                    // Step 1: Show iframe search animation
                    <iframe
                        src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json"
                        frameBorder="0"
                        style={{ width: '100%' }}
                    ></iframe>
                ) : (
                    // Step 2: Show image + content
                    <>
                        <img
                            src="https://www.scopycode.com/includes/images/blog/error_404.gif"
                            alt="404 Not Found"
                            style={{ width: '40%' }}
                        />
                        <div className="content">
                            <p className="subtitle">This page doesn’t exist</p>
                            <a href="/" className="btn_404">Go Home</a>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default _404;
