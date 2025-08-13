"use client";
import { getCategories } from "@/lib/axios/categoryAxios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FiChevronRight, FiChevronLeft, FiChevronDown } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { organizeCategories } from "@/utils/organizeCategories";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";

// Detect browser RTL scroll behavior: 'negative' | 'default' | 'reverse'
function detectRtlScrollType(): 'negative' | 'default' | 'reverse' {
    if (typeof document === 'undefined') return 'negative';
    const outer = document.createElement('div');
    const inner = document.createElement('div');
    outer.style.width = '100px';
    outer.style.height = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    outer.style.overflow = 'scroll';
    outer.dir = 'rtl';
    inner.style.width = '200px';
    inner.style.height = '200px';
    outer.appendChild(inner);
    document.body.appendChild(outer);

    // At creation
    if (outer.scrollLeft > 0) {
        // 'default' (0 at right, positive going left)
        document.body.removeChild(outer);
        return 'default';
    }

    // Try set to 1 and read back
    outer.scrollLeft = 1;
    const type = outer.scrollLeft === 0 ? 'negative' : 'reverse';
    document.body.removeChild(outer);
    return type;
}

// Compute hidden content on visual left/right sides regardless of RTL quirks
function getHiddenVisualSides(
    container: HTMLDivElement,
    isRTL: boolean,
    rtlType: 'negative' | 'default' | 'reverse' | null
) {
    const max = container.scrollWidth - container.clientWidth;
    const sl = container.scrollLeft;

    let hiddenStart = 0; // visual start: left in LTR, right in RTL
    let hiddenEnd = 0;   // visual end: right in LTR, left in RTL

    if (!isRTL) {
        hiddenStart = sl;
        hiddenEnd = max - sl;
    } else {
        const type = rtlType ?? 'negative';
        if (type === 'negative') {
            hiddenStart = -sl;           // right side hidden
            hiddenEnd = max + sl;        // left side hidden
        } else if (type === 'default') {
            hiddenStart = sl;            // right side hidden
            hiddenEnd = max - sl;        // left side hidden
        } else {
            // reverse
            hiddenStart = max - sl;      // right side hidden
            hiddenEnd = sl;              // left side hidden
        }
    }

    const hiddenLeftVisual = isRTL ? hiddenEnd : hiddenStart;
    const hiddenRightVisual = isRTL ? hiddenStart : hiddenEnd;
    return { hiddenLeftVisual, hiddenRightVisual, max };
}

export default function CategoriesBar() {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMouseInDropdown = useRef(false);

    const locale = useLocale();
    const isRTL = locale === "ar";
    const [rtlScrollType, setRtlScrollType] = useState<null | 'negative' | 'default' | 'reverse'>(null);

    useEffect(() => {
        if (isRTL) {
            setRtlScrollType(detectRtlScrollType());
        } else {
            setRtlScrollType(null);
        }
    }, [isRTL]);

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    // Update arrow visibility on load/resize
    useEffect(() => {
        const update = () => {
            if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const { hiddenLeftVisual, hiddenRightVisual } = getHiddenVisualSides(container, isRTL, rtlScrollType);
                const threshold = 4; // px threshold to avoid flicker
                setShowLeftArrow(hiddenLeftVisual > threshold);
                setShowRightArrow(hiddenRightVisual > threshold);
            }
        };

        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [categories, isRTL, rtlScrollType]);

    // Handle mouse movement between category and dropdown
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dropdownRef.current || !hoveredCategory) return;

            // Check if mouse is over dropdown
            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            isMouseInDropdown.current = (
                e.clientX >= dropdownRect.left &&
                e.clientX <= dropdownRect.right &&
                e.clientY >= dropdownRect.top &&
                e.clientY <= dropdownRect.bottom
            );
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [hoveredCategory]);

    const handleCategoryHover = (categoryId: number) => {
        clearTimeout(hideTimeoutRef.current!);
        setHoveredCategory(categoryId);
        isMouseInDropdown.current = false;
    };

    const handleCategoryLeave = () => {
        hideTimeoutRef.current = setTimeout(() => {
            if (!isMouseInDropdown.current) {
                setHoveredCategory(null);
            }
        }, 150);
    };

    const handleDropdownEnter = () => {
        clearTimeout(hideTimeoutRef.current!);
        isMouseInDropdown.current = true;
    };

    const handleDropdownLeave = () => {
        setHoveredCategory(null);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            const container = scrollContainerRef.current;

            // Base deltas (LTR, RTL-negative, RTL-reverse)
            let delta = direction === 'left' ? -scrollAmount : scrollAmount;

            // Flip for RTL 'default' behavior
            if (isRTL && rtlScrollType === 'default') {
                delta = -delta;
            }

            container.scrollBy({ left: delta, behavior: 'smooth' });
        }
    };

    if (isLoading || error || !categories?.data) return null;

    const navCategories = categories.data.filter(cat => cat.include_in_nav);
    if (navCategories.length === 0) return null;

    const displayCategory = organizeCategories(categories.data);

    // Sort categories: those with children first, then those without
    const sortedRootCategories = displayCategory.rootCategoriesWithChildren.sort((a, b) => {
        if (a.children.length > 0 && b.children.length === 0) return -1;
        if (a.children.length === 0 && b.children.length > 0) return 1;
        return 0;
    });

    return (
        <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
            {/* Categories Bar */}
            <div className="bg-white">
                <div className="px-2">
                    <div className="relative flex items-center">
                        {showLeftArrow && (
                            <button
                                onClick={() => scroll('left')}
                                className={`absolute top-1/2 -translate-y-1/2 z-30
                                    bg-white/80 hover:bg-white/95 backdrop-blur-md border border-gray-200
                                    shadow-lg rounded-full w-10 h-10 flex items-center justify-center
                                    transition-all duration-200 hover:scale-110 hover:shadow-xl
                                    left-2`}
                                aria-label="Scroll left"
                            >
                                <FiChevronLeft className="w-6 h-6 text-[#1a7a9a]" />
                            </button>
                        )}

                        {showRightArrow && (
                            <button
                                onClick={() => scroll('right')}
                                className={`absolute top-1/2 -translate-y-1/2 z-30
                                    bg-white/80 hover:bg-white/95 backdrop-blur-md border border-gray-200
                                    shadow-lg rounded-full w-10 h-10 flex items-center justify-center
                                    transition-all duration-200 hover:scale-110 hover:shadow-xl
                                    right-2`}
                                aria-label="Scroll right"
                            >
                                <FiChevronRight className="w-6 h-6 text-[#1a7a9a]" />
                            </button>
                        )}

                        <div
                            ref={scrollContainerRef}
                            className="flex items-center overflow-x-auto scrollbar-hide px-8 max-w-full"
                            onScroll={() => {
                                if (scrollContainerRef.current) {
                                    const { hiddenLeftVisual, hiddenRightVisual } = getHiddenVisualSides(scrollContainerRef.current, isRTL, rtlScrollType);
                                    const threshold = 4;
                                    setShowLeftArrow(hiddenLeftVisual > threshold);
                                    setShowRightArrow(hiddenRightVisual > threshold);
                                }
                            }}
                        >
                            <div className={`flex items-center flex-nowrap mx-3 lg:mx-10 mt-3  px-2 md:px-2 ${isRTL ? 'space-x-reverse' : ''} space-x-6 md:space-x-8 lg:space-x-10`} style={{ minWidth: 'max-content' }}>
                                {sortedRootCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="relative"
                                        onMouseEnter={() => category.children.length > 0 ? handleCategoryHover(category.id) : undefined}
                                        onMouseLeave={category.children.length > 0 ? handleCategoryLeave : undefined}
                                    >
                                        <Link
                                            href={`/shopGrid?categoryid=${category.id}`}
                                            className="flex items-center whitespace-nowrap"
                                        >
                                            <span className="text-lg md:text-lg font-bold py-2 text-black hover:text-[#3740EA] flex items-center gap-1 min-w-fit">
                                                {category.description.name}
                                                {category.children.length > 0 && (
                                                    <FiChevronDown
                                                        className={`ml-1 text-base transition-transform duration-300 ${hoveredCategory === category.id ? "rotate-180" : "rotate-0"}`}
                                                    />
                                                )}
                                                {category.children.length === 0 && (
                                                    <div className="ml-1 w-4 h-4"></div>
                                                )}
                                            </span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {hoveredCategory && (() => {
                    const category = displayCategory.rootCategoriesWithChildren.find(c => c.id === hoveredCategory);
                    return category?.children && category.children.length > 0 && (
                        <motion.div
                            ref={dropdownRef}
                            className="absolute left-0 right-0 z-40 bg-white shadow-xl border-t border-gray-200"
                            style={{
                                top: '100%',
                                minHeight: '200px'
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            onMouseEnter={handleDropdownEnter}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <div className="container mx-auto lg:px-20 py-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {category.children.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            href={`/shopGrid?categoryid=${sub.id}`}
                                            className="group flex items-center gap-4 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                                {sub.description.image ? (
                                                    <Image
                                                        src={sub.description.image}
                                                        alt={sub.description.name}
                                                        width={48}
                                                        height={48}
                                                        className="object-cover w-full h-full"
                                                        style={{ width: "100%", height: "100%" }}
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 text-xl font-bold">
                                                        {sub.description.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {sub.description.name}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
}