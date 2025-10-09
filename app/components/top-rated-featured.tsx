"use client"

import React from "react"
import Image from "next/image";

export function TopRatedFeatured() {
    return (
        <section
            className="mx-auto bg-white rounded-2xl"
            style={{ width: "1436px", height: "778px" }}
        >

            <div className="relative flex items-center justify-center">
                <div
                    className="flex items-center justify-center rounded-full "
                    style={{
                        width: "42.7px",
                        height: "42.7px",
                        backgroundColor: "#C71F37",
                    }}
                >
                   <Image
                        src="/arrow.png"
                        alt="Left Arrow"
                        width={12} // Rounded up from 11.86px
                        height={21} // Rounded up from 20.56px
                        style={{
                            width: "11.86px",
                            height: "20.56px",
                            transform: "rotate(360deg)",
                            color: "#FFFFFF",
                        }}
                        />
                </div>

                <div className="mx-auto rounded-xl bg-white" style={{ width: "1280px", height: "650px" }}>
                    <div className="flex justify-center items-center gap-2">
                        <h2
                            className="font-bold leading-[38.4px]"
                            style={{
                                fontFamily: "Jost",
                                fontSize: "32px",
                                color: "#212121",
                            }}
                        >
                            Featured Top-Rated{" "}
                            <span style={{ color: "#C71F37" }}>Facilities</span>
                        </h2>
                    </div>
                    <p
                        className="mx-auto text-center"
                        style={{
                            width: "640px",
                            height: "28px",
                            marginTop: "12px",
                            fontFamily: "Inter",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "18px",
                            lineHeight: "28px",
                            color: "#707070",
                        }}
                    >
                        Discover exceptional nursing homes with outstanding ratings and reviews.
                    </p>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden" style={{ width: '384px', height: '422px', boxShadow: '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)', }}>
                            <Image
                                src="/cozy nursing home with warm interior, family-friendly senior care center.png"
                                alt="Facility 1"
                                width={382} 
                                height={192} 
                                className="w-[382px] h-[192px] object-cover rounded-t-2xl"
                                />

                            <div className="absolute flex items-center justify-center"
                                style={{
                                    top: '18px',
                                    left: '18px',
                                    width: '117.17px',
                                    height: '28px',
                                    backgroundColor: '#FEF9C3',
                                    borderRadius: '9999px',
                                    padding: '0 8px',
                                }}
                            >
                                <Image
                                    src="/crown.png"
                                    alt="Sponsored icon"
                                    width={16} // Rounded up from 15.75px
                                    height={14}
                                    style={{
                                        width: '15.75px',
                                        height: '14px',
                                    }}
                                    />
                                <span
                                    style={{
                                        fontFamily: 'Inter',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#212121',
                                        marginLeft: '6px',
                                        lineHeight: '17px',
                                    }}
                                >
                                    Sponsored
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-6 ml-2 px-4">
                                <div className="flex items-center gap-1">
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                </div>
                                <span
                                    style={{
                                        fontFamily: 'Inter',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        color: '#707070',
                                    }}
                                >
                                    4.9 (127 reviews)
                                </span>
                                <div
                                    className="flex items-center ml-12 justify-center"
                                    style={{
                                        width: '82.84px',
                                        height: '24px',
                                        backgroundColor: '#DCFCE7',
                                        borderRadius: '9999px',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '67.14px',
                                            height: '15px',
                                            fontFamily: 'Inter',
                                            fontWeight: 500,
                                            fontStyle: 'medium',
                                            fontSize: '12px',
                                            lineHeight: '16px',
                                            textAlign: 'center',
                                            color: '#166534',
                                        }}
                                    >
                                        5-Star CMS
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <h3
                                    style={{
                                        width: '150.66px',
                                        height: '28px',
                                        fontFamily: 'Inter',
                                        fontWeight: 600,
                                        fontStyle: 'semi-bold',
                                        fontSize: '20px',
                                        lineHeight: '28px',
                                        color: '#212121',
                                        marginTop: '8px',
                                        marginLeft: '16px',
                                    }}
                                >
                                    Heritage Manor
                                </h3>
                                <p
                                    style={{
                                        width: '223.12px',
                                        height: '20px',
                                        fontFamily: 'Inter',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        color: '#707070',
                                        marginTop: '4px',
                                        marginLeft: '16px',

                                    }}
                                >
                                    Los Angeles, CA • 2.3 miles away
                                </p>
                                <div className="flex gap-2 mt-2 ml-4">
                                    <div
                                        style={{
                                            width: '93.19px',
                                            height: '24px',
                                            backgroundColor: '#DBEAFE',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'Inter',
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '16px',
                                                color: '#1E40AF',
                                            }}
                                        >
                                            Memory Care
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            width: '101.08px',
                                            height: '24px',
                                            backgroundColor: '#F3E8FF',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'Inter',
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '16px',
                                                color: '#6B21A8',
                                            }}
                                        >
                                            Skilled Nursing
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            width: '93.19px',
                                            height: '24px',
                                            backgroundColor: '#FFEDD5',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'Inter',
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '16px',
                                                color: '#9A3412',
                                            }}
                                        >
                                            Rehabilitation
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-9 ml-2 px-6">
                                <div className="flex items-center gap-2">
                                    <Image
                                    src="/bed.png"
                                    alt="Bed Icon"
                                    width={18} // Rounded up from 17.5px
                                    height={14} 
                                    className="w-[17.5px] h-[14px]"
                                    />
                                    <span
                                        className="text-[#707070]"
                                        style={{
                                            fontFamily: "Inter",
                                            fontWeight: 400,
                                            fontSize: "14px",
                                            lineHeight: "20px",
                                        }}
                                    >
                                        120 beds available
                                    </span>
                                </div>
                                <button
                                    className="rounded-lg"
                                    style={{
                                        width: "114.5px",
                                        height: "36px",
                                        backgroundColor: "#C71F37",
                                        color: "#FFFFFF",
                                        fontFamily: "Inter",
                                        fontWeight: 500,
                                        fontSize: "16px",
                                        lineHeight: "20px",
                                        textAlign: "center",
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                        <div
                            className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                            style={{
                                width: '384px',
                                height: '422px',
                                boxShadow:
                                    '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)',
                            }}
                        >
                           <Image
                                src="/elegant nursing home with beautiful landscaping, luxury senior care facility.png"
                                alt="Facility 1"
                                width={382} 
                                height={192} 
                                className="w-[382px] h-[192px] object-cover rounded-t-2xl"
                                />

                            <div className="flex items-center gap-2 justify-center mt-6 ml-2 px-4">
                                <div className="flex items-center gap-1">
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                </div>
                                <span
                                    style={{
                                        fontFamily: 'Inter',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        color: '#707070',
                                    }}
                                >
                                    4.7 (89 reviews)
                                </span>
                                <div
                                    className="flex items-center ml-12 justify-center"
                                    style={{
                                        width: '82.84px',
                                        height: '24px',
                                        backgroundColor: '#DCFCE7',
                                        borderRadius: '9999px',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '67.14px',
                                            height: '15px',
                                            fontFamily: 'Inter',
                                            fontWeight: 500,
                                            fontStyle: 'medium',
                                            fontSize: '12px',
                                            lineHeight: '16px',
                                            textAlign: 'center',
                                            color: '#166534',
                                        }}
                                    >
                                        5-Star CMS
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <h3
                                    style={{
                                        width: '150.66px',
                                        height: '28px',
                                        fontFamily: 'Inter',
                                        fontWeight: 600,
                                        fontStyle: 'semi-bold',
                                        fontSize: '20px',
                                        lineHeight: '28px',
                                        color: '#212121',
                                        marginTop: '8px',
                                        marginLeft: '16px',
                                    }}
                                >
                                    Serenity Springs
                                </h3>
                                <p
                                    style={{
                                        width: '223.12px',
                                        height: '20px',
                                        fontFamily: 'Inter',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        color: '#707070',
                                        marginTop: '4px',
                                        marginLeft: '16px',

                                    }}
                                >
                                    Miami, FL • 1.8 miles away
                                </p>
                                <div className="flex gap-2 mt-2 ml-4">
                                    <div
                                        style={{
                                            width: '93.19px',
                                            height: '24px',
                                            backgroundColor: '#DBEAFE',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'Inter',
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '16px',
                                                color: '#1E40AF',
                                            }}
                                        >
                                            Assisted Living
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            width: '101.08px',
                                            height: '24px',
                                            backgroundColor: '#DCFCE7',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'Inter',
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '16px',
                                                color: '#166534',
                                            }}
                                        >
                                            Independent Living
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            width: '93.19px',
                                            height: '24px',
                                            backgroundColor: '#FEF9C3',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'Inter',
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '16px',
                                                color: '#854D0E',
                                            }}
                                        >
                                            Respite Care
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-9 ml-2 px-6">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/bed.png"
                                        alt="Bed Icon"
                                        width={18}
                                        height={14} 
                                        className="w-[17.5px] h-[14px]"
                                    />
                                    <span
                                        className="text-[#707070]"
                                        style={{
                                            fontFamily: "Inter",
                                            fontWeight: 400,
                                            fontSize: "14px",
                                            lineHeight: "20px",
                                        }}
                                    >
                                        120 beds available
                                    </span>
                                </div>
                                <button
                                    className="rounded-lg"
                                    style={{
                                        width: "114.5px",
                                        height: "36px",
                                        backgroundColor: "#C71F37",
                                        color: "#FFFFFF",
                                        fontFamily: "Inter",
                                        fontWeight: 500,
                                        fontSize: "16px",
                                        lineHeight: "20px",
                                        textAlign: "center",
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                        <div
                            className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                            style={{
                                width: '384px',
                                height: '422px',
                                boxShadow:
                                    '0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Image
                                src="/cozy nursing home with warm interior, family-friendly senior care center.png"
                                alt="Facility 1"
                                width={382} 
                                height={192} 
                                className="w-[382px] h-[192px] object-cover rounded-t-2xl"
                            />
                            <div className="flex items-center gap-2 mt-6 ml-2 px-4">
                                <div className="flex items-center gap-1">
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                    <Image src="/star.png" alt="star" width={16} height={14} className="w-[15.75px] h-[14px]" />
                                </div>
                                <span
                                    style={{
                                        fontFamily: 'Inter',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        color: '#707070',
                                    }}
                                >
                                    4.4 (156 reviews)
                                </span>
                                <div
                                    className="flex items-center ml-12 justify-center"
                                    style={{
                                        width: '82.84px',
                                        height: '24px',
                                        backgroundColor: '#DBEAFE',
                                        borderRadius: '9999px',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '67.14px',
                                            height: '15px',
                                            fontFamily: 'Inter',
                                            fontWeight: 500,
                                            fontStyle: 'medium',
                                            fontSize: '12px',
                                            lineHeight: '16px',
                                            textAlign: 'center',
                                            color: '#1E40AF',
                                        }}
                                    >
                                        4-Star CMS
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <h3
                                    style={{
                                        width: '202.26px',
                                        height: '28px',
                                        fontFamily: 'Inter',
                                        fontWeight: 600,
                                        fontStyle: 'semi-bold',
                                        fontSize: '20px',
                                        lineHeight: '28px',
                                        color: '#212121',
                                        marginTop: '8px',
                                        marginLeft: '16px',
                                    }}
                                >
                                    Comfort Care Center
                                </h3>
                                <p
                                    style={{
                                        width: '223.12px',
                                        height: '20px',
                                        fontFamily: 'Inter',
                                        fontWeight: 400,
                                        fontStyle: 'normal',
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        color: '#707070',
                                        marginTop: '4px',
                                        marginLeft: '16px',

                                    }}
                                >
                                    Chicago, IL • 3.1 miles away
                                </p>
                                <div className="flex gap-2 mt-2 ml-4">
                                    <div
                                        style={{
                                            width: '93.19px',
                                            height: '24px',
                                            backgroundColor: '#FEE2E2',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'Inter',
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '16px',
                                                color: '#991B1B',
                                            }}
                                        >
                                            Long-term Care
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            width: '101.08px',
                                            height: '24px',
                                            backgroundColor: '#E0E7FF',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'Inter',
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '16px',
                                                color: '#3730A3',
                                            }}
                                        >
                                            Hospice Care
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            width: '93.19px',
                                            height: '24px',
                                            backgroundColor: '#FCE7F3',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'Inter',
                                                fontWeight: 400,
                                                fontSize: '12px',
                                                lineHeight: '16px',
                                                color: '#9D174D',
                                            }}
                                        >
                                            Palliative Care
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-9 ml-2 px-6">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/bed.png"
                                        alt="Bed Icon"
                                        className="w-[17.5px] h-[14px]"
                                        width={18}
                                        height={14} 
                                    />
                                    <span
                                        className="text-[#707070]"
                                        style={{
                                            fontFamily: "Inter",
                                            fontWeight: 400,
                                            fontSize: "14px",
                                            lineHeight: "20px",
                                        }}
                                    >
                                        120 beds available
                                    </span>
                                </div>
                                <button
                                    className="rounded-lg"
                                    style={{
                                        width: "114.5px",
                                        height: "36px",
                                        backgroundColor: "#C71F37",
                                        color: "#FFFFFF",
                                        fontFamily: "Inter",
                                        fontWeight: 500,
                                        fontSize: "16px",
                                        lineHeight: "20px",
                                        textAlign: "center",
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        className="relative mx-auto flex items-center justify-center"
                        style={{
                            width: "326px",
                            height: "52px",
                            borderRadius: "8px",
                            backgroundColor: "#C71F37",
                            boxShadow: "0px 2px 4px -2px rgba(0,0,0,0.1), 0px 4px 6px -1px rgba(0,0,0,0.1)",
                            marginTop: "40px",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "Inter",
                                fontWeight: 600,
                                fontSize: "18px",
                                lineHeight: "28px",
                                color: "#FFFFFF",
                                textAlign: "center",
                            }}
                        >
                            View All Featured Facilities
                        </span>

                        <Image
                            src="/arrow_btn.png"
                            alt="Arrow Icon"
                            width={16}
                            height={16}
                            style={{
                                width: "15.74px",
                                height: "15.74px",
                                position: "absolute",
                                right: "20px",
                            }}
                        />
                    </button>

                </div>
                <div
                    className="flex items-center justify-center rounded-full "
                    style={{
                        width: "42.7px",
                        height: "42.7px",
                        backgroundColor: "#C71F37",
                    }}
                >
                    <Image
                        src="/arrow.png"
                        alt="Right Arrow"
                         width={12}
                        height={21}
                        style={{
                            width: "11.86px",
                            height: "20.56px",
                            transform: "rotate(180deg)",
                            color: "#FFFFFF",
                        }}
                    />

                </div>
            </div>
        </section>
    )
}

export default TopRatedFeatured
