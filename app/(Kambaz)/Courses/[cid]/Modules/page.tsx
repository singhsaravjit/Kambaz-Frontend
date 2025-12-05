/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState,useEffect } from "react";
import { useParams } from "next/navigation";
import * as client from "../../client";
import {
  FormControl,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";

import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";

import { useSelector, useDispatch } from "react-redux";
import {
  addModule,
  editModule,
  updateModule,
  deleteModule,
  setModules
} from "./reducer";

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();

  const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModules();
  }, []);


  const [moduleName, setModuleName] = useState("");

  const { modules } = useSelector((state: any) => state.modulesReducer);

  
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const role = currentUser?.role;
  const canEdit = role === "FACULTY" || role === "ADMIN";

  const finishEdit = (moduleObj: any) => {
    dispatch(updateModule({ ...moduleObj, editing: false }));
  };

  const onCreateModuleForCourse = async () => {
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const createdModule = await client.createModuleForCourse(cid as string, newModule);
    dispatch(setModules([...modules, createdModule]));
  };

   const onRemoveModule = async (moduleId: string) => {
    if (!cid) return;
    await client.deleteModule(cid as string, moduleId);
    dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
  };

   const onUpdateModule = async (module: any) => {
    await client.updateModule(cid as string, module);
    const newModules = modules.map((m: any) => m._id === module._id ? module : m );
    dispatch(setModules(newModules));
  };


  return (
    <div>
      {}
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={onCreateModuleForCourse}
        canEdit={canEdit}
      />

      <br />
      <br />
      <br />
      <br />

      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: any) => (
            <ListGroupItem
              key={module._id}
              className="wd-module p-0 mb-5 fs-5 border-gray"
            >
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />

                
                {module.editing && canEdit ? (
                  <FormControl
                    className="w-50 d-inline-block"
                    defaultValue={module.name}
                    onChange={(e) =>
                      dispatch(
                        updateModule({
                          ...module,
                          name: e.target.value,
                        })
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                         onUpdateModule({ ...module, editing: false });
                      }
                    }}
                  />
                ) : (
                  <span>{module.name}</span>
                )}

                
                {canEdit && (
                  <ModuleControlButtons
                    moduleId={module._id}
                    deleteModule={(moduleId) => {
                      onRemoveModule(moduleId);
                    }}
                    editModule={(moduleId) => {
                      dispatch(editModule(moduleId));
                    }}
                  />
                )}
              </div>

              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: any, index: number) => (
                    <ListGroupItem
                      key={lesson._id || `${module._id}-lesson-${index}`}
                      className="wd-lesson p-3 ps-1"
                    >
                      <BsGripVertical className="me-2 fs-3" />
                      {lesson.name}

                      
                      {canEdit && <LessonControlButtons />}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}