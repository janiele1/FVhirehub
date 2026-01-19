import Image from "next/image"
// import Link from "next/link"

interface LogoProps {
    className?: string
    width?: number
    height?: number
}

export function Logo({ className = "", width = 150, height = 150 }: LogoProps) {
    return (
        <div className={`flex items-center ${className}`}>
            <Image
                src="/logo.png"
                alt="FV HIREHUB Logo"
                width={width}
                height={height}
                className="object-contain"
                priority
            />
        </div>
    )
}
