
import React, { useState } from "react";
import { ICONS } from "components";
import styled from "styled-components";


export const Wrapper = styled.div`
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    div {
        display: flex;
        justify-content: space-between;
    }
    button:focus {
        outline:1px solid var(--specialColor1);
    }
    .image_content__wrapper {
        display: flex;
        width:100%;
        justify-content: center;
        flex-direction: column;
        gap:5px;
        div {
            display: flex;
            width:100%;
            justify-content: center;
            flex-direction: row;
            button:focus, img:focus {
                    outline:1px solid var(--specialColor1);
                }
            .imageEmptyBtn, .imageBtn, .image__wrapper {
                width: 100px;
                height: 60px;
                border:none;
                outline:none;
                cursor:pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                background: rgba(0, 0, 0, 0.1);
            }
            .imageBtn {
                background:transparent;
                width:30px;
                height:60px;

            }
            img {
                width:100%;
                height:100%;
                object-fit:cover;
            }
        }
        .images_sliders__buttons {
            display: flex;
            justify-content: center;
            gap:5px;
            height:40px;
            button, div {
                height:20px;
                width:100%;
                max-width: 50px;
                background:black;
                svg path {
                    fill:white;
                }
            }
            div {
                color:black;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius:5px;
                background:var(--specialColor2)
            }
        }
    }
    
`

interface Props {
    image: null | File;
    setImage: (image: null | File) => void;
    imageURL?:string;
    labelInnerText?: string;
    required?: boolean;
}

export default function ImageInputElement(props: Props) {
    const { required, setImage, labelInnerText, image } = props;
    const [imageURL, setImageURL] = useState<string>("");
 
    const imageFile = (): void => {
        const inputFile = document.getElementById("image-file") as HTMLInputElement;
        if(inputFile)inputFile.click();
    }
    const handleImage = (image: FileList | null): void => {
        if (image) {
            setImageURL(URL.createObjectURL(image[0]));
            setImage(image[0]);
        }
    }
    return (<>
        <Wrapper>
            <div>
                <label htmlFor='image'>{(labelInnerText || "Photo")}
                    {required ?
                        <span className="red"> *</span>
                        : null}
                </label>
            </div>
            <div className="image_content__wrapper">
                <input hidden
                    type="file"
                    id="image-file"
                    accept="image/*"
                    onChange={(e) => handleImage((e.target as HTMLInputElement).files)}
                />
                <div>
                    {image ? <>
                        <button className="imageBtn" onClick={imageFile} title={("Edit")}>
                            <ICONS name="pen-to-square-solid" color='black' />
                        </button>
                        <div className="image__wrapper" onClick={imageFile} >
                            <img alt="" src={imageURL} />
                        </div>
                        <button style={{ display: image ? "flex" : "none" }} className="imageBtn" onClick={()=>  setImage(null)} title={("Delete")}>
                            <ICONS name="trash-solid" color='black' />
                        </button>
                    </>
                        :
                        <button className="imageEmptyBtn" type="button" onClick={imageFile}>
                            <ICONS name='camera-solid' color='black' />
                        </button>
                    }
                </div>
            </div>
        </Wrapper>
    </>
    )
}