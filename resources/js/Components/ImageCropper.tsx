import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { RiCloseLine, RiCheckLine, RiZoomInLine } from '@remixicon/react';

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedBlob: Blob) => void;
    onCancel: () => void;
    aspectRatio?: number;
}

export default function ImageCropper({ image, onCropComplete, onCancel, aspectRatio = 3/4 }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = (crop: { x: number, y: number }) => setCrop(crop);
    const onZoomChange = (zoom: number) => setZoom(zoom);

    const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleConfirm = async () => {
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
            if (croppedBlob) onCropComplete(croppedBlob);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 sm:p-8">
            <div className="relative w-full max-w-2xl h-[400px] sm:h-[500px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={onCropCompleteInternal}
                    classes={{ containerClassName: 'rounded-3xl' }}
                />
            </div>

            <div className="mt-8 w-full max-w-2xl bg-white rounded-[2rem] p-6 shadow-2xl flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <RiZoomInLine size={20} className="text-slate-400" />
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                </div>

                <div className="flex justify-between items-center gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-50 transition-all border border-slate-100"
                    >
                        <RiCloseLine size={20} /> BATAL
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-200 transition-all"
                    >
                        <RiCheckLine size={20} /> POTONG & SIMPAN
                    </button>
                </div>
            </div>
            
            <p className="mt-6 text-white/60 text-xs font-bold uppercase tracking-widest animate-pulse">
                Sesuaikan posisi foto untuk hasil terbaik
            </p>
        </div>
    );
}
