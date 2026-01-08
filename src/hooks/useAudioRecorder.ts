import { useState, useRef, useCallback } from 'react';

interface UseAudioRecorderReturn {
    isRecording: boolean;
    audioBlob: Blob | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    error: string | null;
    clearAudio: () => void;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' }); // webm is standard for MediaRecorder
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop()); // Stop mic access
            };

            mediaRecorder.start();
            setIsRecording(true);
            setError(null);
        } catch (err: any) {
            console.error('Error accessing microphone:', err);
            setError('Permissão de microfone negada ou não disponível.');
            setIsRecording(false);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, []);

    const clearAudio = useCallback(() => {
        setAudioBlob(null);
    }, []);

    return {
        isRecording,
        audioBlob,
        startRecording,
        stopRecording,
        error,
        clearAudio
    };
};
