/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="@types/segment-analytics" />

declare global {
    interface Window {
        analytics: SegmentAnalytics;
    }
}
