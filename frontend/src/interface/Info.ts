export interface InfoInterface {
    id?: number;
    line_number?: string;
    location?: string;
    from?: string;
    to?: string;
    drawing_number?: string;
    service?: string;
    material?: string;
    inservice_date?: string;
    pipe_size?: number;
    original_thickness?: number;
    stress?: number;
    joint_efficiency?: number;
    ca?: number;
    design_life?: number;
    design_pressure?: number;
    operating_pressure?: number;
    design_temperature?: number;
    operating_temperature?: number;
}