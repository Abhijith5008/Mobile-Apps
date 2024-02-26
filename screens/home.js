import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoteModal from '../component/noteModal';
import DescriptionModal from '../component/description';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import DeleteComp from '../component/deleteIcon';
import EditComp from '../component/editIcon';
import EditNoteModal from '../component/editNoteModal';
import Fuse from 'fuse.js';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const { width, height } = Dimensions.get("window");

export default function Home() {
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [hideSearch, setHideSearch] = useState(false);
    const [notes, setNotes] = useState('');
    const [searchNotes, setSeachNotes] = useState('');
    const [openData, setOpenData] = useState(false);
    const [searchInput, setSearchInput] = useState(null);
    const [modalData, setModalData] = useState(false);
    const [editData, setEditData] = useState(false);
    const plusRef = useRef(null);
    const searchRef = useRef(null);
    const logoRef = useRef(null);

    const handleSearch = (value) => {
        setSearchInput(value);
        const fuse = new Fuse(searchNotes, {
            shouldSort: true,
            threshold: 0.1,
            location: 0,
            distance: 100,
            keys: ['title', 'description']
        });
        const results = fuse.search(value);
        const finalResult = [];
        if (results && results.length > 0) {
            results.forEach((item) => {
                finalResult.push(item.item);
            });
            const fuseResult = [...finalResult];
            setSeachNotes(fuseResult);
        } else {
            setSeachNotes(notes);
        }
    };

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('Notes');
            if (jsonValue) {
                const parsedNotes = JSON.parse(jsonValue);
                setNotes(parsedNotes);
                setSeachNotes(parsedNotes);
            }
        } catch (e) {
            console.error('Error loading notes:', e);
        }
    };

    const formatDate = (array) => {
        let sortedData = null;
        if (array) {
            sortedData = [...array].sort((a, b) => b.createdDate - a.createdDate).reverse();
        }
        return sortedData !== null ? sortedData : array;
    };

    const openModal = () => {
        setOpen(true);
        plusRef.current?.animate('rotate', 500);
    };

    const formatTime = (date) => {
        let newDate = date;
        if (newDate) {
            newDate = moment(date).calendar();
        }
        return newDate;
    };

    const RightSwipeActions = () => {
        return (
            <DeleteComp />
        );
    };

    const LeftSwipeActions = () => {
        return (
            <EditComp />
        );
    };

    const viewPressed = (data) => {
        setModalData(data);
        setOpenData(true);
    };

    const handleRightOpen = async (data) => {
        setTimeout(async function () {
            const updatedNotes = notes.filter((note) => note.id !== data.id);
            setNotes(updatedNotes);
            setSeachNotes(updatedNotes);
            await AsyncStorage.setItem('Notes', JSON.stringify(updatedNotes));
        }, 200);
    };

    const handleLeftEdit = async (data) => {
        setEditData(data);
        setOpenEdit(true);
    };

    useEffect(() => {
        //AsyncStorage.removeItem('Notes');
        getData();
    }, []);

    const totalNotes = notes.length;

    const Item = ({ id, title, date }) => {
        return (
            <View style={{ margin: 1, alignItems: "center" }}>
                <GestureHandlerRootView>
                    <Swipeable
                        renderLeftActions={LeftSwipeActions}
                        renderRightActions={RightSwipeActions}
                        leftThreshold={0.5}
                        rightThreshold={0.5}
                        onSwipeableOpen={direction => {
                            if (direction === "right") {
                                handleRightOpen(id);
                            } else if (direction === "left") {
                                handleLeftEdit(id);
                            }
                        }}
                    >
                        <TouchableOpacity onPress={() => viewPressed(id)} style={styles.touch}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                                    <Feather name={id.iconName === "note" ? 'edit-2' : 'calendar'} size={15} />
                                    <Text style={styles.title}>{title} </Text>
                                </View>
                                <Text style={styles.dateLabel}>{formatTime(date)} </Text>
                            </View>
                        </TouchableOpacity>
                    </Swipeable>
                </GestureHandlerRootView>
            </View>
        )
    };

    const saveNote = async (note) => {
        try {
            const updatedNotes = [...notes, note];
            setNotes(updatedNotes);
            setSeachNotes(updatedNotes);
            await AsyncStorage.setItem('Notes', JSON.stringify(updatedNotes));
            setOpen(false);
        } catch (error) {
            console.error('Error saving note', error);
        }
    };

    const updateNote = async (data) => {
        if (data) {
            try {
                const filterList = notes.filter((note) => note.id !== data.id);
                const updatedNotes = [...filterList, data];
                setNotes(updatedNotes);
                setSeachNotes(updatedNotes);
                await AsyncStorage.setItem('Notes', JSON.stringify(updatedNotes));
                setOpenEdit(false);
            } catch (error) {
                console.error('Error saving note', error);
            }
        }
    };

    const renderSwipeableItem = ({ item }) => (
        <Item title={item.title} id={item} date={item.createdDate} />
    );

    const handleIconPress = () => {
        setHideSearch(true);
    };

    const handleView = () => {
        setSeachNotes(notes);
        if (searchRef.current) {
            searchRef.current.animate("bounceOut", 400);
        };
        setTimeout(function () {
            setHideSearch(false);
        }, 200);
    };

    const handleSearchClear = () => {
        if (searchInput === null) {
            searchRef.current?.animate("bounceOut", 400);
            setSearchInput(null);
            setTimeout(function () {
                setHideSearch(false);
            }, 200);
        } else {
            setSearchInput(null);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getData();
        }, [])
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {hideSearch == false ?
                    <Animatable.View ref={logoRef} animation={"fadeIn"} duration={400} easing="ease" style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Image
                            style={styles.titleImage}
                            source={require('../assets/AppLogo.png')}
                        />
                        {notes.length > 0 ? (<TouchableOpacity onPress={handleIconPress}>
                            <Ionicons name="search" size={10 * 2.7} color="#000" style={{ padding: 10, margin: 10 }} />
                        </TouchableOpacity>
                        ) : null}
                    </Animatable.View>
                    :
                    <Animatable.View
                        ref={searchRef}
                        easing="ease"
                        animation="bounceInRight"
                        duration={600}
                        style={[styles.touch, { marginLeft: 14, margin: 5, flexDirection: "row", justifyContent: "space-between" }]}
                    >
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
                            <TouchableOpacity onPress={handleView}>
                                <Ionicons name="chevron-back" size={24} color="#000" />
                            </TouchableOpacity>
                            <TextInput
                                placeholder="Search .."
                                value={searchInput}
                                style={{
                                    color: "#333232",
                                    fontSize: 10 * 2,
                                    marginLeft: 10,
                                    width: 200
                                }}
                                onChangeText={(e) => handleSearch(e)}
                            />
                            <Ionicons name="search" size={24} color="#000" />
                        </View>
                        <TouchableOpacity onPress={handleSearchClear}>
                            <Ionicons name="close-outline" size={25} color="#000" />
                        </TouchableOpacity>
                    </Animatable.View>
                }
                {notes.length === 0 ? (
                    <Text style={{ padding: 5, margin: 5 }}>Note-orious disappearance ! ! ! </Text>
                ) : (
                    <View style={{ flex: 1 }} >
                        <Text style={{ fontSize: 12, fontWeight: 'bold', margin: 5, padding: 5 }}>{totalNotes} notes</Text>
                        <FlatList
                            style={styles.main}
                            data={formatDate(searchNotes)}
                            keyExtractor={(item) => item.id}
                            renderItem={renderSwipeableItem}
                        />
                    </View>
                )}
                <NoteModal
                    visible={open}
                    onClose={() => setOpen(false)}
                    onSave={saveNote}
                    iconText="note"
                />
                <EditNoteModal
                    visible={openEdit}
                    onClose={() => setOpenEdit(false)}
                    onUpdate={updateNote}
                    data={editData}
                />
                {openData === true && (
                    <BottomSheetModalProvider>
                            <DescriptionModal
                                visible={openData}
                                data={modalData}
                                onClose={() => setOpenData(false)}
                            />
                    </BottomSheetModalProvider>
                )}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => openModal()}
                >
                    <Animatable.View ref={plusRef}>
                        <Text style={styles.addButtonText}>+</Text>
                    </Animatable.View>
                </TouchableOpacity>
            </View >
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 45,
        backgroundColor: '#fcfcf7',
    },
    main: {
        flex: 1,
    },
    header: {
        fontSize: 30,
        fontWeight: '900',
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 20
    },
    titleImage: {
        marginLeft: 10,
        width: 80,
        height: 60,
        alignItems: "center",
        alignContent: "center",
        resizeMode: "contain",
    },
    dateLabel: {
        fontSize: 10,
    },
    touch: {
        width: width / 1.1 - 10,
        height: height / 14,
        margin: 2,
        backgroundColor: '#fcfcf7',
        padding: 15,
        borderRadius: 9,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 110,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#333232',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fcfcf7',
        fontSize: 30,
        fontWeight: "900"
    },
    deleteSwipeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    deleteButton: {
        backgroundColor: 'red',
        padding: 15,
        marginVertical: 10,
        marginRight: 20,
        borderRadius: 5,
    },

    deleteButtonText: {
        color: '#fcfcf7',
        fontWeight: 'bold',
    },
});
