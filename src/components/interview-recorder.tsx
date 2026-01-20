/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useEffect, useCallback } from "react"
import { useReactMediaRecorder } from "react-media-recorder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, StopCircle, CheckCircle, Camera, Mic, AlertCircle } from "lucide-react"

// import { useRouter } from "next/navigation"

interface InterviewSessionProps {
    application: any
    questions: any[]
    interview: any
}

export default function InterviewSession({ application, questions, interview }: InterviewSessionProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [sessionComplete, setSessionComplete] = useState(false)
    const [phase, setPhase] = useState<'setup' | 'intro' | 'thinking' | 'answering'>('setup')
    // const router = useRouter()
    const videoRef = useRef<HTMLVideoElement>(null)
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
    const [permissionError, setPermissionError] = useState<string | null>(null)
    const [timeLeft, setTimeLeft] = useState(0)

    const currentQuestion = questions[currentQuestionIndex]
    const isLastQuestion = currentQuestionIndex === questions.length - 1

    // 1. Acquire Media Stream on Mount
    useEffect(() => {
        let stream: MediaStream | null = null

        async function enableStream() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { max: 640, ideal: 640 },
                        height: { max: 480, ideal: 480 },
                        frameRate: { max: 15, ideal: 15 }
                    },
                    audio: true
                })
                setMediaStream(stream)
                setPermissionError(null)
            } catch (err: unknown) {
                console.error("Failed to access camera/mic", err)
                setPermissionError((err as Error).message || "Camera and Microphone access is required for this interview.")
            }
        }

        enableStream()

        // Cleanup stream on unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    // 2. Attach stream to video element - runs when mediaStream or phase changes
    useEffect(() => {
        if (videoRef.current && mediaStream) {
            // Only set if not already set (prevents blinking)
            if (videoRef.current.srcObject !== mediaStream) {
                videoRef.current.srcObject = mediaStream
            }
        }
    }, [mediaStream, phase]) // Re-run when phase changes to handle new video elements

    // 3. Pass custom stream to recorder
    const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
        useReactMediaRecorder({
            video: true,
            audio: true,
            blobPropertyBag: { type: "video/webm" },
            customMediaStream: mediaStream || undefined,
            // @ts-expect-error - videoBitsPerSecond is supported by the underlying MediaRecorder
            videoBitsPerSecond: 128000 // 128 kbps - Aggressive compression for speed
        })

    const recordingType = useRef<'thinking' | 'answer'>('thinking')

    // Warn before closing tab if uploading
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isUploading) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [isUploading])

    // Watch for recording stop to trigger upload behavior
    // For 'thinking' -> auto upload in background (or skip if we don't care about thinking videos success as much? usually we do)
    // For 'answer' -> triggering handleUpload which will block UI
    useEffect(() => {
        if (status === 'stopped' && mediaBlobUrl) {
            const type = recordingType.current
            const url = mediaBlobUrl
            handleUpload(url, type)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, mediaBlobUrl])

    const startInterview = () => {
        setPhase('intro')
    }

    const startFirstQuestion = () => {
        setPhase('thinking')
        setTimeLeft(currentQuestion?.thinking_time_seconds || 30)
        recordingType.current = 'thinking'
        startRecording()
    }

    const startAnswer = useCallback(() => {
        if (phase === 'thinking') {
            recordingType.current = 'thinking'
            stopRecording() // This triggers upload for thinking video

            setPhase('answering')
            setTimeLeft(currentQuestion?.time_limit_seconds || 60)

            // Small delay to ensure recorder resets
            setTimeout(() => {
                recordingType.current = 'answer'
                startRecording()
            }, 100)
        }
    }, [currentQuestion, phase, stopRecording, startRecording])

    const handleStopRecording = () => {
        // Just stop. The effect will catch it and call handleUpload.
        stopRecording()
    }

    // Timer logic
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
            return () => clearInterval(timer)
        } else if (timeLeft === 0 && phase === 'thinking') {
            startAnswer()
        } else if (timeLeft === 0 && phase === 'answering' && status === 'recording') {
            handleStopRecording()
        }
    }, [timeLeft, phase, status, startAnswer]) // Removed handleStopRecording from deps

    const handleNextQuestion = async () => {
        if (isLastQuestion) {
            setSessionComplete(true)
            // Trigger server action to finalize submission
            try {
                const { finishInterview } = await import("@/app/actions/applications")
                await finishInterview(application.id)
            } catch (err) {
                console.error("Failed to finish interview:", err)
            }
        } else {
            setCurrentQuestionIndex((prev) => prev + 1)
            setPhase('thinking')
            const nextQuestion = questions[currentQuestionIndex + 1]
            setTimeLeft(nextQuestion?.thinking_time_seconds || 30)

            recordingType.current = 'thinking'
            setTimeout(() => {
                startRecording()
            }, 250)
        }
    }

    const [uploadProgress, setUploadProgress] = useState(0)

    const handleUpload = async (blobUrl: string, type: 'thinking' | 'answer') => {
        if (!blobUrl) return

        if (interview.isPreview) {
            console.log(`[Preview Mode] Skipping upload for ${type} video`)
            if (type === 'answer') {
                handleNextQuestion()
            }
            clearBlobUrl()
            return
        }

        // For answers, we show the blocking loading state
        if (type === 'answer') {
            setIsUploading(true)
            setUploadProgress(0)
        }

        try {
            const blob = await fetch(blobUrl).then((r) => r.blob())
            if (blob.size <= 0) throw new Error("Video is empty. Please refresh and try again.")

            const fileName = `${application.id}/${currentQuestion.id}_${type}.webm`

            const { createClient } = await import('@/lib/supabase-client')
            const { saveVideoMetadata } = await import('@/app/actions/save-video-metadata')
            const supabase = createClient()

            // 1. UPLOAD
            const { error: uploadError } = await supabase.storage
                .from('videos')
                .upload(fileName, blob, {
                    upsert: true,
                    contentType: 'video/webm'
                })

            if (uploadError) throw uploadError

            // 2. METADATA
            const duration = type === 'thinking'
                ? (currentQuestion.thinking_time_seconds - timeLeft)
                : (currentQuestion.time_limit_seconds - timeLeft)

            const result = await saveVideoMetadata(
                application.id,
                currentQuestion.id,
                fileName,
                Math.max(0, duration),
                type
            )

            if (!result.success) throw new Error(result.error)

            // Success!
            if (type === 'answer') {
                clearBlobUrl()
                // Proceed to next question ONLY after successful upload
                handleNextQuestion()
            }

        } catch (error: any) {
            console.error("Upload failed:", error)
            alert(`Failed to upload: ${error?.message || "Unknown error"}. Please try again.`)
        } finally {
            if (type === 'answer') {
                setIsUploading(false)
            }
        }
    }

    // --- RENDER: Completion Screen ---
    if (sessionComplete) {
        return (
            <Card className="text-center overflow-hidden border-none shadow-2xl bg-white">
                <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500" />
                <CardContent className="py-16 px-8 space-y-8">
                    <div className="flex justify-center flex-col items-center gap-4">
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle className="h-16 w-16 text-green-600 animate-in zoom-in duration-500" />
                        </div>

                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Interview Submitted!
                        </h2>
                    </div>

                    <div className="max-w-md mx-auto space-y-6">
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Fantastic job! Your responses have been securely uploaded and the hiring team has been notified.
                        </p>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left space-y-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-blue-500" />
                                What happens next?
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                                    <span>The hiring team will review your video responses within 3-5 business days.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                                    <span>If match is found, you&apos;ll receive an email to schedule a live interview.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                                    <span>You can close this window now. Good luck!</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // --- RENDER: Setup/Permissions Screen ---
    if (phase === 'setup') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Camera & Microphone Setup
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-slate-600">
                        Before we begin, let&apos;s make sure your camera and microphone are working properly.
                        You should see yourself in the preview below.
                    </p>

                    <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative">
                        {permissionError ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                                <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Permission Denied</h3>
                                <p className="text-slate-300 text-sm mb-4">{permissionError}</p>
                                <p className="text-slate-400 text-xs">
                                    Please allow camera and microphone access in your browser settings and refresh the page.
                                </p>
                            </div>
                        ) : mediaStream ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-white">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="ml-2">Loading camera...</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 justify-center">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${mediaStream ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            <Camera className="h-4 w-4" />
                            Camera {mediaStream ? 'Ready' : 'Pending'}
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${mediaStream ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            <Mic className="h-4 w-4" />
                            Mic {mediaStream ? 'Ready' : 'Pending'}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                        <h4 className="font-semibold mb-2">Tips for a great interview:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Find a quiet, well-lit space</li>
                            <li>Position yourself in the center of the frame</li>
                            <li>Speak clearly and at a normal pace</li>
                            <li>You&apos;ll have thinking time before each question</li>
                        </ul>
                    </div>

                    <Button
                        onClick={startInterview}
                        size="lg"
                        className="w-full"
                        disabled={!mediaStream}
                    >
                        {mediaStream ? "I'm Ready - Start Interview" : "Waiting for Camera..."}
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // --- RENDER: Recruiter Intro View (ALWAYS SHOWN) ---
    if (phase === 'intro') {
        return (
            <Card>
                <CardContent className="space-y-6 pt-6">
                    {interview.recruiter_intro_video_path ? (
                        <div className="space-y-4">
                            <p className="text-slate-600">Please watch this introduction from our team:</p>
                            <video
                                src={interview.recruiter_intro_video_path}
                                controls
                                autoPlay
                                className="w-full aspect-video rounded-lg bg-black"
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-100 p-8 shadow-sm">


                                {interview.description && (
                                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                                        {interview.description.split('\n').map((paragraph: string, i: number) => (
                                            <p key={i} className="text-base md:text-lg">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-blue-500" />
                                        Interview Process
                                    </h4>
                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                            <span className="text-sm text-slate-600">{questions.length} Question{questions.length !== 1 ? 's' : ''}</span>
                                        </li>
                                        <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                            <span className="text-sm text-slate-600">Thinking time included</span>
                                        </li>
                                        <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                            <span className="text-sm text-slate-600">Auto-submit</span>
                                        </li>
                                        <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                                            <span className="text-sm text-slate-600">One-way video</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button onClick={startFirstQuestion} size="lg" className="w-full">
                        Start Questions →
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // --- RENDER: Main Interview Flow (Thinking/Answering) ---
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    {phase === 'thinking' && <span className="text-blue-600 font-medium">Thinking Time...</span>}
                    {phase === 'answering' && status === 'recording' && <span className="text-red-500 font-medium font-mono animate-pulse">● Recording</span>}
                    {phase === 'answering' && status !== 'recording' && <span className="text-amber-600 font-medium">● Submit Video</span>}
                </div>
                <Progress value={((currentQuestionIndex) / questions.length) * 100} />
            </div>

            <Card>
                <CardHeader className="relative">
                    {interview.isPreview && (
                        <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white text-[10px] py-1 px-3 text-center font-bold uppercase tracking-widest rounded-t-lg">
                            Preview Mode - No data will be saved
                        </div>
                    )}
                    <CardTitle className={interview.isPreview ? "pt-4" : ""}>{currentQuestion?.question_text}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                        {/* Timer Overlay */}
                        <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-xl font-bold z-10 ${phase === 'thinking' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>

                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                                <div className="text-white flex flex-col items-center">
                                    <Loader2 className="h-12 w-12 animate-spin mb-4" />
                                    <p>
                                        Optimizing & Uploading...
                                        <span className="text-yellow-400 font-bold ml-1">Do not close!</span>
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">Almost there...</p>
                                </div>
                            </div>
                        )}

                        {phase === 'thinking' && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="text-center text-white p-6 bg-black/50 rounded-xl backdrop-blur-sm pointer-events-auto">
                                    <h3 className="text-2xl font-bold mb-2">Think about your answer</h3>
                                    <p className="text-slate-200 mb-4">Recording will start automatically when timer ends.</p>
                                    <Button onClick={startAnswer} variant="secondary">Start Answering Now</Button>
                                </div>
                            </div>
                        )}



                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    </div>


                    {phase === 'answering' && (
                        <Button
                            onClick={handleStopRecording}
                            variant={status === 'recording' ? "destructive" : "default"}
                            size="lg"
                            className="w-full"
                            disabled={isUploading}
                        >
                            {status === 'recording' ? (
                                <>
                                    <StopCircle className="mr-2 h-4 w-4" />
                                    {isLastQuestion ? 'Finish' : 'Next Question'}
                                </>
                            ) : isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    {/* Normal state */}
                                    {isLastQuestion ? 'Finish Interview' : 'Next Question'}
                                </>
                            )}
                        </Button>
                    )}

                </CardContent>
            </Card>

            <div className="text-center text-xs text-slate-400">
                <p>Your answer will be uploaded automatically. No retakes allowed.</p>
            </div>
        </div>
    )
}
