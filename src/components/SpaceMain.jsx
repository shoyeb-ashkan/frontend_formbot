import "./styles/spacemain.css";
import createFolder from "../assets/svgs/create-folder.svg";
import deleteIcon from "../assets/svgs/delete.svg";
import { useTheme } from "../utils/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import SpaceForm from "./SpaceForm";
import CreateFormOrFolder from "../components/CreateFormOrFolder";
import { useEffect, useState } from "react";
import {
  backToDefault,
  createFolderOrForm,
  deleteFolderOrForm,
} from "../features/space/spaceSlice";
import { toast } from "react-hot-toast";
import DeleteFormOrFolder from "./DeleteFormOrFolder";

const SpaceMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { space, loading } = useSelector((state) => state.space);
  const { user } = useSelector((state) => state.user);
  const { folderId, spaceId } = useParams();

  const [name, setName] = useState("");
  const [mode, setMode] = useState("Folder");
  const [showCreateFormOrFolder, setShowCreateFormOrFolder] = useState(false);
  const [showDeleteFormOrFolder, setShowDeleteFormOrFolder] = useState(false);
  const [itemId, setItemId] = useState("");

  //active space to check the permission of the user
  const activeSpace =
    user?.spaces?.find(({ space }) => space._id.toString() === spaceId) || {};

  // get the forms of root directory or folder
  const forms = folderId
    ? space.rootFolder.find((folder) => folder._id === folderId)?.children || []
    : space.rootFolder.filter((item) => !item.isFolder);

  useEffect(() => {
    if (!folderId) return; // Ensure folderId is defined

    // check if the folder exists in the root folder
    const folderExists = space.rootFolder.some(
      (item) => item._id.toString() === folderId.toString()
    );

    if (!folderExists) {
      navigate("/404"); // Use absolute path
    }
  }, [folderId]);

  // set the mode of the form or folder to add
  const handleSetAddFormOrFolder = (type) => {
    setMode(type);
    setShowCreateFormOrFolder(true);
  };

  // set the mode of the form or folder and the item id to delete
  const handleSetDeleteFormOrFolder = (type, itemId) => {
    setItemId(itemId);
    setMode(type);
    setShowDeleteFormOrFolder(true);
  };

  // arrow function to create a form or folder based on mode
  const handleCreateFormOrFolder = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(`${mode} name cannot be empty.`);
      return;
    }

    // form data to create a form or folder, parent id is the folder id or empty string. For, Folder parent id is empty always.
    const formData = {
      name,
      parentId: mode === "Form" && folderId ? folderId : "",
      isFolder: mode === "Folder",
    };

    const result = await dispatch(createFolderOrForm({ spaceId, formData }));

    if (result.type === "space/createFolderOrForm/fulfilled") {
      dispatch(backToDefault());
      setShowCreateFormOrFolder(false);
    }
  };

  const handleDeleteFormOrFolder = async (e) => {
    e.preventDefault();

    const formData = {
      parentId: mode === "Form" && folderId ? folderId : "",
    };

    const result = await dispatch(
      deleteFolderOrForm({ spaceId, formData, itemId })
    );

    if (result.type === "space/deleteFolderOrForm/fulfilled") {
      dispatch(backToDefault());
      setShowDeleteFormOrFolder(false);
      if (mode === "Folder") {
        navigate(`/space/${spaceId}`);
      }
    }
  };

  return (
    <div className="space__main__container">
      <div className="space__folder__container">
        <button
          onClick={() => handleSetAddFormOrFolder("Folder")}
          disabled={!activeSpace?.canEdit || loading}
          className={
            "main__folder__button no-select " +
            (!activeSpace?.canEdit || loading ? "disabled" : "")
          }
        >
          <img
            className={theme === "dark" ? "" : "inversion"}
            src={createFolder}
            alt="create folder"
          />
          Create a folder
        </button>
        {/* render the folder to route to the folder  */}
        {space.rootFolder
          .filter((folder) => folder.isFolder)
          .map((folder) => (
            <div
              key={folder._id}
              className="main__folder__link__container no-select"
            >
              <Link
                className={
                  "no-select main__folder__link " +
                  (folder._id === folderId
                    ? "main__folder__link__active "
                    : "") +
                  (loading ? "disabled" : "")
                }
                to={loading ? "#" : `/space/${spaceId}/folder/${folder._id}`}
                onClick={(e) => {
                  if (loading) e.preventDefault();
                }}
              >
                <span>{folder.name}</span>
              </Link>
              <button
                onClick={() =>
                  handleSetDeleteFormOrFolder("Folder", folder._id)
                }
                disabled={!activeSpace?.canEdit || loading}
                className={
                  "main__folder__delete__button " +
                  (!activeSpace?.canEdit || loading ? "disabled" : "")
                }
              >
                <img src={deleteIcon} alt="delete" />
              </button>
            </div>
          ))}
      </div>
      {/* render the form according to the route */}
      <SpaceForm
        loading={loading}
        handleAddFormOrFolder={handleSetAddFormOrFolder}
        handleDeleteFormOrFolder={handleSetDeleteFormOrFolder}
        forms={forms}
        spaceId={spaceId}
        canEdit={activeSpace?.canEdit}
      />

      {showCreateFormOrFolder && (
        <CreateFormOrFolder
          mode={mode}
          setName={setName}
          setShow={setShowCreateFormOrFolder}
          onSubmit={handleCreateFormOrFolder}
        />
      )}
      {showDeleteFormOrFolder && (
        <DeleteFormOrFolder
          mode={mode}
          setShow={setShowDeleteFormOrFolder}
          onSubmit={handleDeleteFormOrFolder}
        />
      )}
    </div>
  );
};

export default SpaceMain;
