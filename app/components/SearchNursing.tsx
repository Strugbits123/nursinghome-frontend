"use client";

import React from "react";

export function SearchNursing() {
    return (
        <section
            className="w-full bg-[#D02B38]"
            style={{
                width: "1920px",
                height: "513px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: "1280px",
                    height: "272px",
                    marginTop: "35px",
                    backgroundColor: "#D02B38",
                }}
            >
                <h2
                    style={{
                        width: "722.5px",
                        fontFamily: "Inter",
                        fontWeight: 700,
                        fontSize: "36px",
                        lineHeight: "40px",
                        color: "#FFFFFF",
                        textAlign: "center",
                        margin: "0 auto",
                    }}
                >
                    Ready to Find the Perfect Nursing Home?
                </h2>
                <p
                    style={{
                        width: "790px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                        fontSize: "20px",
                        lineHeight: "28px",
                        color: "#DBEAFE",
                        textAlign: "center",
                        margin: "8px auto 0",
                    }}
                >
                    Join thousands of families who have found exceptional care through our
                    platform. Start your search today.
                </p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                        marginTop: "40px",
                    }}
                >
                    <button
                        style={{
                            width: "242.7px",
                            height: "64px",
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF",
                            boxShadow:
                                "0px 2px 4px -2px rgba(0,0,0,0.1),0px 4px 6px -1px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                        }}
                    >
                        <img
                            src="/vector_search_nursing.png"
                            alt="Search Icon"
                            style={{
                                width: "18px",
                                height: "18px",
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "Inter",
                                fontWeight: 600,
                                fontSize: "18px",
                                lineHeight: "28px",
                                color: "#D02B38",
                            }}
                        >
                            Start Your Search
                        </span>
                    </button>

                    <button
                        style={{
                            width: "251.47px",
                            height: "64px",
                            borderRadius: "8px",
                            backgroundColor: "transparent",
                            border: "2px solid #FFFFFF",
                            boxShadow:
                                "0px 2px 4px -2px rgba(0,0,0,0.1),0px 4px 6px -1px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                        }}
                    >
                        <img
                            src="/phone_search_icon.png"
                            alt="Expert Icon"
                            style={{
                                width: "18px",
                                height: "18px",
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "Inter",
                                fontWeight: 600,
                                fontSize: "18px",
                                lineHeight: "28px",
                                color: "#FFFFFF",
                            }}
                        >
                            Speak with Expert
                        </span>
                    </button>

                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "80px",
                        marginTop: "32px",
                        marginLeft: "20px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <img
                            src="/nursing_sm_search.png"
                            alt="Free to use"
                            style={{ width: "16px", height: "16px" }}
                        />
                        <span
                            style={{
                                fontFamily: "Inter",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#DBEAFE",
                            }}
                        >
                            Free to use
                        </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <img
                            src="/nursing_sm_search.png"
                            alt="Trusted platform"
                            style={{ width: "16px", height: "16px" }}
                        />
                        <span
                            style={{
                                fontFamily: "Inter",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#DBEAFE",
                            }}
                        >
                            No registration required
                        </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <img
                            src="/nursing_sm_search.png"
                            alt="Fast search"
                            style={{ width: "16px", height: "16px" }}
                        />
                        <span
                            style={{
                                fontFamily: "Inter",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#DBEAFE",
                            }}
                        >
                            Expert support available
                        </span>
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between", 
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "1400px",
                    marginTop: "50px",
                    padding: "0 50px",
                }}
            >
                <div style={{ maxWidth: "350px" }}>
                    <h4
                        style={{
                            fontFamily: "Jost",
                            fontWeight: 600,
                            fontSize: "24px",
                            lineHeight: "36px",
                            color: "#FFFFFF",
                            margin: 0,
                        }}
                    >
                        Subscribe Our Newsletter!
                    </h4>
                    <p
                        style={{
                            fontFamily: "Jost",
                            fontWeight: 400,
                            fontSize: "15px",
                            lineHeight: "27px",
                            color: "rgba(255,255,255,0.75)",
                            margin: "12px 0 0",
                        }}
                    >
                        Subscribe our marketing platforms for latest updates
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#FFFFFF1A",
                        border: "1px solid #FFFFFF33",
                        borderRadius: "50px",
                        width: "526px",
                        height: "72px",
                        padding: "0 12px",
                    }}
                >
                    <input
                        type="email"
                        placeholder="Your Email Here..."
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "#FFFFFF",
                            fontFamily: "Jost",
                            fontSize: "15px",
                            padding: "0 16px",
                        }}
                    />
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            width: "169.36px",
                            height: "54px",
                            borderRadius: "50px",
                            border: "1px solid #FFFFFF",
                            backgroundColor: "#FFFFFF",
                            cursor: "pointer",
                            padding: "0 16px",
                        }}
                    >
                        <img
                            src="/svg.png"
                            alt="Subscribe Icon"
                            style={{
                                width: "20px",
                                height: "20px",
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "Jost",
                                fontWeight: 500, 
                                fontSize: "15px",
                                lineHeight: "22.5px",
                                color: "#212529", 
                                textAlign: "center",
                            }}
                        >
                            Subscribe
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}
