"use client";

import { useLottie, LottieOptions } from "lottie-react";
import React, { useMemo } from "react";

interface LottieAnimationProps {
    animationData: object;
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
    width?: number | string;
    height?: number | string;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
    animationData,
    loop = true,
    autoplay = true,
    className,
    width,
    height,
}) => {
    const options: LottieOptions = useMemo(
        () => ({
            animationData,
            loop,
            autoplay,
        }),
        [animationData, loop, autoplay]
    );

    const { View } = useLottie(options, { width, height });

    return <div className={className}>{View}</div>;
};
