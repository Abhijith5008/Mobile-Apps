import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import 'react-native-get-random-values';
import * as Animatable from 'react-native-animatable';
import { AntDesign, Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get("window");

const EditNoteModal = ({ visible, onClose, onUpdate, data }) => {
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [error, setError] = useState(false);
    const updateRef = useRef(null);
    const closeBtnRef = useRef(null);
    const closeUpdateModalRef = useRef(null);

    const [showFont, setShowFont] = useState(false);
    const [showList, setShowList] = useState(false);
    const [showAlign, setShowAlign] = useState(false);
    const styleViewRef = useRef(null);
    const richText = useRef(null);

    const handleClose = () => {
        setError(false);
        closeBtnRef.current?.animate('slideOutRight', 400, 0, 'ease-out');
        setTimeout(function () { onClose() }, 100);
        closeUpdateModalRef.current?.animate('slideOutRight', 600, 0, 'ease-out');
    };

    const handleImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 });
            const str = `data:${result.type}; base64,${base64}`;
            richText.current?.insertImage(str);
        } else {
            //handle error
        }
    };

    const saveNote = (note) => {
        onUpdate(note);
        setTitle('');
        setDescription('');
    }

    const handleSave = () => {
        if (title && description) {
            const date = new Date();
            setError(false);
            const newNote = {
                id: data.id,
                title: title,
                description: description,
                createdDate: date,
                iconName: data.iconName
            };
            if (updateRef.current) {
                updateRef.current?.animate('bounceOutDown', 500, 0, 'ease-out');
                setTimeout(function () { saveNote(newNote); }, 400);
                closeUpdateModalRef.current?.animate('zoomOutDown', 300, 0, 'ease-out');
            }
        } else {
            setError(true);
            if (updateRef.current) {
                updateRef.current.animate('shake', 1000);
            }
        }
    };

    useEffect(() => {
        setError(false);
    }, []);


    useEffect(() => {
        if (data) {
            setDescription(data.description);
            setTitle(data.title);
        }
    }, [data]);

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Animatable.View
                animation="bounceInLeft"
                duration={800}
                easing={'ease-in'}
                ref={closeUpdateModalRef}
                style={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Note</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
                    <View style={{ flex: 1 }}>
                        <ScrollView style={styles.textEditor} keyboardDismissMode='interactive' contentContainerStyle={{ flexGrow: 1 }}>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
                                <RichEditor
                                    placeholder="Description"
                                    ref={richText}
                                    editorStyle={{ backgroundColor: "#fcfcf7" }}
                                    initialContentHTML={description}
                                    onChange={descriptionText => {
                                        setDescription(descriptionText);
                                    }}

                                />
                            </KeyboardAvoidingView>
                        </ScrollView>
                        <View style={styles.buttonView}>
                            {showFont === false && showList === false && showAlign === false && (
                                <TouchableOpacity style={[styles.addButton]} onPress={() => { setShowFont(true) }}>
                                    <FontAwesome5 name="font" size={20} color="#fcfcf7" />
                                </TouchableOpacity>
                            )}
                            {showList === false && showFont === false && showAlign === false && (
                                <TouchableOpacity style={[styles.addButton]} onPress={() => { setShowList(true) }}>
                                    <Feather name="list" size={24} color="#fcfcf7" />
                                </TouchableOpacity>
                            )}

                            {showList === false && showFont === false && showAlign === false && (
                                <TouchableOpacity style={[styles.addButton]} onPress={() => { setShowAlign(true) }}>
                                    <Feather name="align-center" size={24} color="#fcfcf7" />
                                </TouchableOpacity>
                            )}

                            {showList === false && showFont === false && showAlign === false &&
                                <View style={[styles.addButton]}>
                                    <RichToolbar
                                        editor={richText}
                                        actions={[
                                            actions.insertImage,
                                        ]}
                                        iconMap={{ [actions.insertImage]: ({ }) => (<Feather name='image' size={20} style={{ color: "#fcfcf7" }} />), }}
                                        onPressAddImage={handleImages}
                                        style={[styles.customButton, { padding: 0 }]}
                                    />
                                </View>
                            }
                        </View>
                        {showFont === true && (
                            <Animatable.View ref={styleViewRef} animation="lightSpeedIn" easing='ease-in' duration={400} style={{ flexDirection: "row-reverse", justifyContent: "space-evenly", alignItems: "center", position: "absolute", bottom: 10, left: 60 }}>
                                <TouchableOpacity onPress={() => { setTimeout(function () { setShowFont(false); }, 500); styleViewRef.current.animate("lightSpeedOut", 300, 0, 'ease-out'); }} style={{ margin: 5, alignItems: "center" }}>
                                    <AntDesign name="close" size={30} color="black" />
                                </TouchableOpacity>
                                <RichToolbar
                                    editor={richText}
                                    actions={[
                                        actions.setUnderline,
                                    ]}
                                    unselectedButtonStyle={styles.customButtonUnselected}
                                    selectedButtonStyle={styles.customButton}
                                    iconMap={{ [actions.setUnderline]: ({ }) => (<Feather name='underline' size={20} style={{ color: "#fcfcf7" }} />), }}
                                    style={styles.toolbarStyle}
                                />
                                <RichToolbar
                                    editor={richText}
                                    actions={[
                                        actions.setItalic,
                                    ]}
                                    unselectedButtonStyle={styles.customButtonUnselected}
                                    selectedButtonStyle={styles.customButton}
                                    iconMap={{ [actions.setItalic]: ({ }) => (<Feather name='italic' size={20} style={{ color: "#fcfcf7" }} />), }}
                                    style={styles.toolbarStyle}
                                />
                                <RichToolbar
                                    editor={richText}
                                    actions={[
                                        actions.setBold,
                                    ]}
                                    unselectedButtonStyle={styles.customButtonUnselected}
                                    selectedButtonStyle={styles.customButton}
                                    iconMap={{ [actions.setBold]: ({ }) => (<Feather name='bold' size={20} style={{ color: '#fcfcf7' }} />), }}
                                    style={styles.toolbarStyle}
                                />
                            </Animatable.View>
                        )}
                        {showList === true && (
                            <Animatable.View ref={styleViewRef} animation="lightSpeedIn" easing='ease-in' duration={400} style={{ flexDirection: "row-reverse", justifyContent: "space-evenly", alignItems: "center", position: "absolute", bottom: 10, left: 60 }}>
                                <TouchableOpacity onPress={() => { setTimeout(function () { setShowList(false); }, 500); styleViewRef.current.animate("lightSpeedOut", 300, 0, 'ease-out'); }} style={{ margin: 5, alignItems: "center" }}>
                                    <AntDesign name="close" size={30} color="black" />
                                </TouchableOpacity>
                                <RichToolbar
                                    editor={richText}
                                    actions={[
                                        actions.checkboxList,
                                    ]}
                                    unselectedButtonStyle={styles.customButtonUnselected}
                                    selectedButtonStyle={styles.customButton}
                                    iconMap={{ [actions.checkboxList]: ({ }) => (<Feather name='check-square' size={20} style={{ color: '#fcfcf7' }} />), }}
                                    style={styles.toolbarStyle}
                                />
                                <RichToolbar
                                    editor={richText}
                                    actions={[
                                        actions.insertBulletsList
                                    ]}
                                    unselectedButtonStyle={styles.customButtonUnselected}
                                    selectedButtonStyle={styles.customButton}
                                    iconMap={{ [actions.insertBulletsList]: ({ }) => (<FontAwesome name='list-ul' size={20} style={{ color: "#fcfcf7" }} />), }}
                                    style={styles.toolbarStyle}
                                />
                                <RichToolbar
                                    editor={richText}
                                    actions={[
                                        actions.insertOrderedList
                                    ]}
                                    unselectedButtonStyle={styles.customButtonUnselected}
                                    selectedButtonStyle={styles.customButton}
                                    iconMap={{ [actions.insertOrderedList]: ({ }) => (<FontAwesome name='list-ol' size={20} style={{ color: "#fcfcf7" }} />), }}
                                    style={styles.toolbarStyle}
                                />
                            </Animatable.View>
                        )}

                        {showAlign === true && (
                            <Animatable.View ref={styleViewRef} animation="lightSpeedIn" easing='ease-in' duration={400} style={{ flexDirection: "row-reverse", justifyContent: "space-evenly", alignItems: "center", position: "absolute", bottom: 10, left: 40 }}>
                                <TouchableOpacity onPress={() => { setTimeout(function () { setShowAlign(false); }, 500); styleViewRef.current.animate("lightSpeedOut", 300, 0, 'ease-out'); }} style={{ margin: 5, alignItems: "center" }}>
                                    <AntDesign name="close" size={30} color="black" />
                                </TouchableOpacity>
                                <RichToolbar
                                    editor={richText}
                                    actions={[
                                        actions.alignCenter,
                                    ]}
                                    unselectedButtonStyle={styles.customButtonUnselected}
                                    selectedButtonStyle={styles.customButton}
                                    iconMap={{ [actions.alignCenter]: ({ }) => (<Feather name='align-center' size={20} style={{ color: '#fcfcf7' }} />), }}
                                    style={styles.toolbarStyle}
                                />
                                <RichToolbar
                                    editor={richText}
                                    actions={[
                                        actions.alignFull,
                                    ]}
                                    unselectedButtonStyle={styles.customButtonUnselected}
                                    selectedButtonStyle={styles.customButton}
                                    iconMap={{ [actions.alignFull]: ({ }) => (<FontAwesome name='align-justify' size={20} style={{ color: "#fcfcf7" }} />), }}
                                    style={styles.toolbarStyle}
                                />
                                <RichToolbar
                                    editor={richText}
                                    actions={[
                                        actions.alignLeft
                                    ]}
                                    unselectedButtonStyle={styles.customButtonUnselected}
                                    selectedButtonStyle={styles.customButton}
                                    iconMap={{ [actions.alignLeft]: ({ }) => (<FontAwesome name='align-left' size={20} style={{ color: "#fcfcf7" }} />), }}
                                    style={styles.toolbarStyle}
                                />
                                <RichToolbar
                                    editor={richText}
                                    actions={[
                                        actions.alignRight
                                    ]}
                                    unselectedButtonStyle={styles.customButtonUnselected}
                                    selectedButtonStyle={styles.customButton}
                                    iconMap={{ [actions.alignRight]: ({ }) => (<FontAwesome name='align-right' size={20} style={{ color: "#fcfcf7" }} />), }}
                                    style={styles.toolbarStyle}
                                />
                            </Animatable.View>
                        )}

                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[{ backgroundColor: error === true ? 'red' : 'black' }, styles.button]} onPress={handleSave}>
                            <Animatable.View ref={updateRef}>
                                <Feather name={'save'} size={25} color="#fcfcf7" />
                            </Animatable.View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{ backgroundColor: 'black' }, styles.button]} onPress={() => handleClose()}>
                            <Animatable.View ref={closeBtnRef}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </Animatable.View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animatable.View>
        </Modal >
    );
};
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        height: height / 1.3,
        width: width / 1.1,
        backgroundColor: '#fcfcf7',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    timeTitle: {
        fontSize: 14,
        fontWeight: '300',
        alignSelf: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    largeInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        height: 100,
    },
    textEditor: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    closeButtonText: {
        color: '#fcfcf7',
        fontWeight: '900',
        fontSize: 18,
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    toolbarStyle: {
        backgroundColor: '#fcfcf7',
    },
    roundedView: {
        width: width / 1.2 - 15,
        margin: 2,
        backgroundColor: '#fcfcf7',
        padding: 15,
        borderRadius: 7,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    addButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 35,
        height: 35,
        backgroundColor: '#333232',
        borderRadius: 25,
        margin: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    buttonView: {
        flexDirection: "row",
        alignSelf: "center",
        position: 'absolute',
        bottom: 10,
    },
    customButton: {
        marginHorizontal: 7,
        alignItems: "center",
        width: 35,
        height: 35,
        backgroundColor: '#333232',
        borderRadius: 25,
        margin: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    customButtonUnselected: {
        opacity: 0.5,
        marginHorizontal: 7,
        alignItems: "center",
        alignSelf: "center",
        width: 35,
        height: 35,
        backgroundColor: '#333232',
        borderRadius: 25,
        margin: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
export default EditNoteModal;
